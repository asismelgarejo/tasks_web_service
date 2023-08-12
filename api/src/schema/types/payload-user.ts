import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import UserError from "./user-error";
import User from "./User";

const UserPayload = new GraphQLObjectType({
  name: "UserPayload",
  fields: () => ({
    errors: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserError))),
    },
    user: {
      type: User,
    },
    authToken: {
      type: GraphQLString,
    },
  }),
});

export default UserPayload;
