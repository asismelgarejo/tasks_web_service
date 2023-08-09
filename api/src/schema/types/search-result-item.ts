import {
  GraphQLID,
  GraphQLInterfaceType,
  GraphQLNonNull,
  GraphQLString,
} from "graphql";
import Task from "./Task";
import Approach from "./Approach";

const SearchResultItem: GraphQLInterfaceType = new GraphQLInterfaceType({
  name: "SearchResultItem",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    content: { type: new GraphQLNonNull(GraphQLString) },
  }),
  resolveType(obj) {
    if (obj.type === "task") {
      return Task;
    }
    if (obj.type === "approach") {
      return Approach;
    }
  },
});
export default SearchResultItem;
