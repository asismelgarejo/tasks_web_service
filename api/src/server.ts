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
  server.use("/", async (req, res) => {
    const authToken =
      req && req.headers && req.headers.authorization
        ? req.headers.authorization.slice(7)
        : null;
    const currentUser = await pgApi.mutators.userFromAuthToken(authToken ?? "");
    if (authToken && !currentUser) {
      res.status(401).send({
        errors: [{ message: "Invalid access token" }],
      });
      return;
    }

    const loaders: TDataLoaders = {
      users: new DataLoader<string, UserModel>((usersId) =>
        pgApi.userInfo(usersId)
      ),
      approaches: new DataLoader<string, ApproachModel[]>((tasksId) =>
        pgApi.approachList(tasksId)
      ),
      tasks: new DataLoader<string, TaskModel>((tasksId) =>
        pgApi.tasksInfo({ tasksId, currentUser })
      ),
      tasksByTypes: new DataLoader<string, TaskModel[]>((types) =>
        pgApi.taskMainList(types)
      ),
      searchResults: new DataLoader<string, (TaskModel | ApproachModel)[]>(
        (searchTerms) => pgApi.searchResults({ searchTerms, currentUser })
      ),
      detailLists: new DataLoader((approachIds) =>
        mongoApi.detailList(approachIds)
      ),
      tasksForUser: new DataLoader<string, TaskModel[]>((userIds) =>
        pgApi.tasksForUsers(userIds)
      ),
    };

    const mutators = {
      pgApi: pgApi.mutators,
      mongoApi: mongoApi.mutators,
    };

    graphqlHTTP({
      schema,
      graphiql: { headerEditorEnabled: true },
      context: { pgApi, loaders, mutators, currentUser },
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
