import pg from "pg";
import PGAPIWrapper, { PGAPIWrapperMutations } from "../db/pg-api";
import DataLoader from "dataloader";
import UserModel from "./UserModel";
import ApproachModel from "./ApproachModel";
import TaskModel from "./TaskModel";
export type TDataLoaders = {
  users: DataLoader<string, UserModel>;
  approaches: DataLoader<string, ApproachModel[]>;
  tasks: DataLoader<string, TaskModel>;
  tasksByTypes: DataLoader<string, TaskModel[]>;
  searchResults: DataLoader<string, (TaskModel | ApproachModel)[]>;
  detailLists: DataLoader<any, any>;
  tasksForUser: DataLoader<string, TaskModel[]>;
};
export type SourceCustom = { pgPool: pg.Pool };
export type ContextCustom = {
  pgApi: PGAPIWrapper;
  loaders: TDataLoaders;
  mutators: { pgApi: PGAPIWrapperMutations };
  currentUser: UserModel;
};
