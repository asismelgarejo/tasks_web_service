import {
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import TaskModel from "../../models/TaskModel";
import User from "./User";
import { ContextCustom } from "../../models";
import Approach from "./Approach";
import UserModel from "../../models/UserModel";
import ApproachModel from "../../models/ApproachModel";
import SearchResultItem from "./search-result-item";

const Task: GraphQLObjectType<TaskModel, ContextCustom> = new GraphQLObjectType<TaskModel, ContextCustom>({
  name: "Task",
  interfaces: () => [SearchResultItem],
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
    content: {
      type: new GraphQLNonNull(GraphQLString),
    },
    tags: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(GraphQLString))
      ),
      resolve({ tags }) {
        return tags.split(",");
      },
    },
    approachCount: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    createdAt: {
      type: new GraphQLNonNull(GraphQLString),
      resolve({ createdAt }) {
        return createdAt.toISOString();
      },
    },
    author: {
      type: new GraphQLNonNull(User),
      resolve(source, _, { loaders }): Promise<UserModel> {
        return loaders.users.load(source.userId);
      },
    },
    approachList: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Approach))),
      resolve({ id }, _, { loaders }): Promise<ApproachModel[]> {
        return loaders.approaches.load(id);
      },
    },
  },
});

export default Task;
