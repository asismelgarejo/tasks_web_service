import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from "graphql";
import UserError from "./user-error";
import Task from "./Task2";

const TaskPayload = new GraphQLObjectType({
  name: "TaskPayload",
  fields: {
    errors: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserError))),
    },
    task: {
      type: Task,
    },
  },
});

export default TaskPayload;
