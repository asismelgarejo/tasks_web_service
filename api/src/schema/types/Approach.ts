import {
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import User from "./User";
import { ContextCustom } from "../../models";
import ApproachModel from "../../models/ApproachModel";
import UserModel from "../../models/UserModel";
import SearchResultItem from "./search-result-item";
import ApproachDetail from "./ApproachDetail";

const Approach: GraphQLObjectType<ApproachModel, ContextCustom> =
  new GraphQLObjectType<ApproachModel, ContextCustom>({
    name: "Approach",
    interfaces: () => [SearchResultItem],
    fields: {
      id: {
        type: new GraphQLNonNull(GraphQLID),
      },
      content: {
        type: new GraphQLNonNull(GraphQLString),
      },
      voteCount: {
        type: new GraphQLNonNull(GraphQLInt),
      },
      createdAt: {
        type: new GraphQLNonNull(GraphQLString),
        resolve({ createdAt }) {
          const isoString = new Date(createdAt).toISOString();
          return isoString;
        },
      },
      author: {
        type: new GraphQLNonNull(User),
        resolve({ userId }, _, { loaders }): Promise<UserModel> {
          return loaders.users.load(userId);
        },
      },
      detailList: {
        type: new GraphQLNonNull(
          new GraphQLList(new GraphQLNonNull(ApproachDetail))
        ),
        resolve({ id }, _, { loaders }) {
          return loaders.detailLists.load(id);
        },
      },
    },
  });
export default Approach;
