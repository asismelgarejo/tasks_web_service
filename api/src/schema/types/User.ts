import {
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import UserModel from "../../models/UserModel";
import { ContextCustom } from "../../models";

const User = new GraphQLObjectType<UserModel, ContextCustom>({
  name: "User",
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
    username: {
      type: GraphQLString,
    },
    name: {
      type: GraphQLString,
      resolve({ firstName, lastName }) {
        return `${firstName} ${lastName}`;
      },
    },
    // tasksList: {
    //   type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Task))),
    //   resolve({}) {
    //     return ["asdasd"];
    //   },
    // },
  },
});

export default User;
