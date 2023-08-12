import TaskModel from "./TaskModel";
import UserErrorModel from "./UserErrorModel";

type UserModel = {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    // createdAt: Date;
    // tasksList: TaskModel[];
};

export type UserDeletePayload = {
    errors: UserErrorModel[];
    deleteUserId?: number;
};

export default UserModel;
