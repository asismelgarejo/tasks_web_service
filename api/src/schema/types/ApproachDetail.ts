import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import ApproachDetailCategory from "./approach-detail-category";

const ApproachDetail = new GraphQLObjectType({
  name: "ApproachDetail",
  fields: () => ({
    content: {
      type: new GraphQLNonNull(GraphQLString),
    },
    category: {
      type: new GraphQLNonNull(ApproachDetailCategory),
    },
  }),
});

export default ApproachDetail;
