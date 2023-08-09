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

// const currentTime: GraphQLFieldConfig<SourceCustom, ContextCustom> = {
//         type: GraphQLString,
//         resolve: () => {
//           return new Promise((res) => {
//             const isoString = new Date().toISOString();
//             const date = isoString.slice(11, 19);
//             setTimeout(() => res(date), 5000);
//           });
//         },
//       };
//       const sumNumbersInRange: GraphQLFieldConfig<
//         SourceCustom,
//         ContextCustom,
//         {
//           begin: number;
//           end: number;
//         }
//       > = {
//         type: new GraphQLNonNull(GraphQLInt),
//         args: {
//           begin: {
//             type: new GraphQLNonNull(GraphQLInt),
//           },
//           end: {
//             type: new GraphQLNonNull(GraphQLInt),
//           },
//         },
//         resolve(source, { begin, end }, {}): number {
//           let sum = 0;
//           for (let index = begin; index < end; index++) {
//             sum += index;
//           }
//           return sum;
//         },
//       };

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
