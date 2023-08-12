import {
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { ContextCustom, SourceCustom } from "../models";
import Task from "./types/Task";
import TaskModel from "../models/TaskModel";
import SearchResultItem from "./types/search-result-item";
import User, { Me } from "./types/User";

export const QueryType = new GraphQLObjectType<SourceCustom, ContextCustom>({
  name: "Query",
  fields: {
    // currentTime,
    // sumNumbersInRange: sumNumbersInRange as any,
    taskMainList: {
      type: new GraphQLList(new GraphQLNonNull(Task)),
      async resolve(source, _, { loaders }) {
        return loaders.tasksByTypes.load("latest");
      },
    },
    taskInfo: {
      type: Task,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
        },
      },
      resolve(_, { id }, { loaders }): Promise<TaskModel> {
        return loaders.tasks.load(id);
      },
    },
    search: {
      type: new GraphQLNonNull(new GraphQLList(SearchResultItem)),
      args: {
        term: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(_, { term }, { loaders }) {
        return loaders.searchResults.load(term);
      },
    },
    me: {
      type: Me,
      resolve(_, __, { currentUser }) {
        return currentUser;
      },
    },
    // numbersInRange: {
    //   type: NumbersInRange,
    //   args: {
    //     begin: {
    //       type: new GraphQLNonNull(GraphQLInt),
    //     },
    //     end: {
    //       type: new GraphQLNonNull(GraphQLInt),
    //     },
    //   },
    //   resolve(source, { begin, end }, ctx) {
    //     return numbersInRangeObject(begin, end);
    //   },
    // },
  },
});
