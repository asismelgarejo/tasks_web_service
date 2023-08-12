import {
  GraphQLFieldConfig,
  GraphQLFieldConfigMap,
  GraphQLFieldMap,
  GraphQLID,
  GraphQLInputFieldConfigMap,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
  Thunk,
} from "graphql";
import UserModel from "../../models/UserModel";
import { ContextCustom } from "../../models";
import Task from "./Task2";
import TaskModel from "../../models/TaskModel";

type UserFields<T, K> = {
  id: GraphQLFieldConfig<T, K>;
  username: GraphQLFieldConfig<T, K>;
  name: GraphQLFieldConfig<T, K>;
  taskList?: GraphQLFieldConfig<T, K>;
};

const fieldsWrapper = ({
  meScope,
}: {
  meScope: boolean;
}): Thunk<GraphQLFieldConfigMap<UserModel, ContextCustom>> => {
  const usersFields: UserFields<UserModel, ContextCustom> = {
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
    username: {
      type: GraphQLString,
    },
    name: {
      type: GraphQLString,
      resolve({ firstName, lastName }) {
        return [firstName, lastName].filter(Boolean).join(" ");
      },
    },
  };
  if (meScope) {
    usersFields.taskList = {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Task))),
      async resolve(_, __, { currentUser, loaders }): Promise<TaskModel[]> {
        return loaders.tasksForUser.load(currentUser.id);
      },
    };
  }
  return usersFields as Thunk<GraphQLFieldConfigMap<UserModel, ContextCustom>>;
};

const User = new GraphQLObjectType<UserModel, ContextCustom>({
  name: "User",
  fields: fieldsWrapper({ meScope: false }),
});
export const Me = new GraphQLObjectType<UserModel, ContextCustom>({
  name: "Me",
  fields: fieldsWrapper({ meScope: true }),
});

export default User;
