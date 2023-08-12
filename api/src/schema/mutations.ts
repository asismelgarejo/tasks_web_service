import { GraphQLNonNull, GraphQLObjectType } from "graphql";
import UserPayload from "./types/payload-user";
import UserInput from "./types/input-user";
import { ContextCustom } from "../models";
import AuthInput from "./types/input-auth";
import TaskPayload from "./types/payload-task";
import TaskInput from "./types/input-task";

const MutationType = new GraphQLObjectType<any, ContextCustom>({
  name: "Mutation",
  fields: () => ({
    userCreate: {
      type: new GraphQLNonNull(UserPayload),
      args: {
        input: { type: new GraphQLNonNull(UserInput) },
      },
      async resolve(source, { input }, { mutators }) {
        return mutators.pgApi.userCreate({ input });
      },
    },
    userLogin: {
      type: new GraphQLNonNull(UserPayload),
      args: {
        input: {
          type: new GraphQLNonNull(AuthInput),
        },
      },
      resolve(_, { input }, { mutators }) {
        return mutators.pgApi.userLogin({ input });
      },
    },
    taskCreate: {
      type: TaskPayload,
      args: {
        input: {
          type: new GraphQLNonNull(TaskInput),
        },
      },
      resolve(_, { input }, { mutators, currentUser }) {
        return mutators.pgApi.taskCreate({ input, currentUser });
      },
    },
  }),
});

export default MutationType;
