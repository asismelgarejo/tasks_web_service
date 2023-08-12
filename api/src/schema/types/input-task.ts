import { GraphQLBoolean, GraphQLInputObjectType, GraphQLList, GraphQLNonNull, GraphQLString } from "graphql";

const TaskInput = new GraphQLInputObjectType({
    name: "TaskInput",
    fields: () => ({
        content: {
            type: new GraphQLNonNull(GraphQLString),
        },
        tags: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLString))),
        },
        isPrivate: {
            type: new GraphQLNonNull(GraphQLBoolean),
        },
    }),
});
export const TaskUpdateInput = new GraphQLInputObjectType({
    name: "TaskUpdateInput",
    fields: () => ({
        content: {
            type: GraphQLString,
        },
        tags: {
            type: new GraphQLList(new GraphQLNonNull(GraphQLString)),
        },
        isPrivate: {
            type: GraphQLBoolean,
        },
    }),
});

export default TaskInput;
