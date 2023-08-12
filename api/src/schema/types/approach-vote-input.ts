import { GraphQLBoolean, GraphQLInputObjectType, GraphQLNonNull } from "graphql";

const ApproachVoteInput = new GraphQLInputObjectType({
    name: "ApproachVoteInput",
    fields: () => ({
        up: {
            type: new GraphQLNonNull(GraphQLBoolean),
        },
    }),
});

export default ApproachVoteInput;
