import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import DataLoader from "dataloader";
import { graphqlHTTP } from "express-graphql";

import * as config from "./config";
import { schema } from "./schema";
import { printSchema } from "graphql";
import pgClient from "./db/pg-client";
import PGAPIWrapper, { PGDriver } from "./db/pg-api";
import UserModel from "./models/UserModel";
import ApproachModel from "./models/ApproachModel";
import { TDataLoaders } from "./models";
import TaskModel from "./models/TaskModel";
import MongoApiWrapper, { MongoDriver } from "./db/mongo-api";

async function main() {
  const server = express();
  server.use(cors());
  server.use(morgan("dev"));
  server.use(bodyParser.urlencoded({ extended: false }));
  server.use(bodyParser.json());
  server.use("/:fav.ico", (req, res) => res.sendStatus(204));
  // const { pgPool } = await pgClient();
  const pg = new PGDriver();
  await pg.init();
  const pgApi = new PGAPIWrapper(pg);

  const mongoService = new MongoDriver();
  await mongoService.init();
  const mongoApi = new MongoApiWrapper(mongoService);
  // Example route
  // server.use('/', (req, res) => {
  //   res.send('Hello World');
  // });

  console.log(printSchema(schema));
  server.use("/", (req, res) => {
    const loaders: TDataLoaders = {
      users: new DataLoader<string, UserModel>((usersId) =>
        pgApi.userInfo(usersId)
      ),
      approaches: new DataLoader<string, ApproachModel[]>((tasksId) =>
        pgApi.approachList(tasksId)
      ),
      tasks: new DataLoader<string, TaskModel>((taskId) =>
        pgApi.tasksInfo(taskId)
      ),
      tasksByTypes: new DataLoader<string, TaskModel[]>((types) =>
        pgApi.taskMainList(types)
      ),
      searchResults: new DataLoader<string, (TaskModel | ApproachModel)[]>(
        (term) => pgApi.searchResults(term)
      ),
      detailLists: new DataLoader((approachIds) =>
        mongoApi.detailList(approachIds)
      ),
    };
    graphqlHTTP({
      schema,
      graphiql: true,
      context: { pgApi, loaders },
      customFormatErrorFn(err) {
        return err;
      },
    })(req, res);
  });

  // This line rus the server
  server.listen(config.port, () => {
    console.log(`Server URL: http://localhost:${config.port}/`);
  });
}

main();
