import TaskModel from "./TaskModel";
import UserErroModel from "./UserErrorModel";

type TaskPayloadModel = {
  errors: UserErroModel[];
  task?: TaskModel;
};

export default TaskPayloadModel;
