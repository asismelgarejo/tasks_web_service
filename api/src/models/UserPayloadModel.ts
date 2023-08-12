import UserModel from "./UserModel";

type UserPayloadModel = {
  errors: string[];
  user?: UserModel | null;
  authToken?: string;
};

export default UserPayloadModel;
