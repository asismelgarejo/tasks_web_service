import {
  GraphQLBoolean,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
} from "graphql";

const TaskInput = new GraphQLInputObjectType({
  name: "TaskInput",
  fields: () => ({
    content: {
      type: new GraphQLNonNull(GraphQLString),
    },
    tags: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(GraphQLString))
      ),
    },
    isPrivate: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
  }),
});

export default TaskInput;
