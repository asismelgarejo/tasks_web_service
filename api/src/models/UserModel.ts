import TaskModel from "./TaskModel";

type UserModel = {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  tasksList: TaskModel[];
};

export default UserModel;
