import { GraphQLID, GraphQLList, GraphQLNonNull, GraphQLObjectType } from "graphql";
import UserError from "./user-error";

const UserDeletePayload = new GraphQLObjectType({
    name: "UserDeletePayload",
    fields: {
        errors: {
            type: new GraphQLNonNull(new GraphQLList(UserError)),
        },
        deleteUserId: {
            type: new GraphQLNonNull(GraphQLID),
        },
    },
});

export default UserDeletePayload;
