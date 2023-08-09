// import { SourceCustom, ContextCustom } from "../models";
// import { buildSchema } from "graphql";

// export const schema = buildSchema(`
//   type Query {
//     currentTime: String!
//   }
// `);

// export const rootValue = {
//   currentTime: () => {
//     const isoString = new Date().toISOString();
//     return isoString.slice(11, 19);
//   },
// };
import { GraphQLSchema } from "graphql";
// import NumbersInRange from "./types/numbers-in-range";
// import { numbersInRangeObject } from "../utils";
// import Task from "./types/Task";
// import sqls from "../db/sqls";
import { QueryType } from "./queries";

export const schema = new GraphQLSchema({
  query: QueryType,
});
