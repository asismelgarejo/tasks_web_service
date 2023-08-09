import { GraphQLInt, GraphQLNonNull, GraphQLObjectType } from "graphql";

const NumbersInRange = new GraphQLObjectType({
  name: "NumbersInRange",
  description: "Aggrate into an object",
  fields: {
    sum: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    count: {
      type: new GraphQLNonNull(GraphQLInt),
    },
  },
});

export default NumbersInRange;
