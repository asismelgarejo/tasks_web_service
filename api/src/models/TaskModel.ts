import UserModel from "./UserModel";

type TaskModel = {
  id: string;
  content: string;
  tags: string;
  approachCount: number;
  createdAt: Date;
  // author: UserModel;
  userId: string;
};

export default TaskModel;
