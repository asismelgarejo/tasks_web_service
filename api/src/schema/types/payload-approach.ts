import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from "graphql";
import UserError from "./user-error";
import Approach from "./Approach";

const ApproachPayload = new GraphQLObjectType({
    name: "MutationType",
    fields: {
        errors: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserError))),
        },
        approach: {
            type: Approach,
        },
    },
});

export default ApproachPayload;
