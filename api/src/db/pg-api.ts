import { QueryResult, Pool, QueryResultRow } from "pg";
import pgClient from "./pg-client";
import sqls from "./sqls";
import TaskModel from "../models/TaskModel";
import UserModel from "../models/UserModel";
import ApproachModel from "../models/ApproachModel";
import UserInputModel from "../models/UserInputModel";
import AuthInputModel from "../models/AuthInputModel";
import { randomString } from "../utils";
import UserPayloadModel from "../models/UserPayloadModel";
import TaskInputModel from "../models/TaskInputModel";
import TaskPayloadModel from "../models/TaskPayloadModel";

export class PGDriver {
  private pgPool: Pool | null = null;
  async init() {
    const { pgPool } = await pgClient();
    this.pgPool = pgPool;
  }

  public async pgQuery(
    text: string,
    params: Record<string, any> = {}
  ): Promise<QueryResult<QueryResultRow>> {
    if (!this.pgPool) throw new Error("Something unexpected happened");
    return await this.pgPool.query(text, Object.values(params));
  }
}
export class PGAPIWrapperMutations {
  constructor(private pg: PGDriver) {}

  async userCreate({ input }: UserInputModel): Promise<UserPayloadModel> {
    const payload: UserPayloadModel = {
      errors: [],
      user: null,
      authToken: "",
    };
    if (!input.password.length) {
      payload.errors.push("Use a stronger password");
    }
    if (payload.errors.length) return payload;
    const authToken = randomString();
    const pgResp = await this.pg.pgQuery(sqls.userInsert, {
      $1: input.username.toLowerCase(),
      $2: input.password,
      $3: input.firstName,
      $4: input.lastName,
      $5: authToken,
    });
    if (pgResp.rows[0]) {
      payload.user = pgResp.rows[0] as UserModel;
      payload.authToken = authToken;
    }
    return payload;
  }
  async userLogin({ input }: AuthInputModel): Promise<UserPayloadModel> {
    const payload: UserPayloadModel = {
      errors: [],
      // user: null,
      // authToken: "",
    };
    if (!input.username || !input.password) {
      payload.errors.push("Username or password must be provided");
    }
    if (!payload.errors.length) {
      const pgResp = await this.pg.pgQuery(sqls.userFromCredentials, {
        $1: input.username.toLowerCase(),
        $2: input.password,
      });
      const user = pgResp.rows[0] as UserModel;
      if (user) {
        const authToken = randomString();
        await this.pg.pgQuery(sqls.userUpdateAuthToken, {
          $1: user.id,
          $2: authToken,
        });

        payload.authToken = authToken;
        payload.user = user as UserModel;
      } else {
        console.log("raios");
        payload.errors.push("User not found");
      }
    }
    return payload;
  }
  async userFromAuthToken(authToken: string): Promise<UserModel> {
    const pgResp = await this.pg.pgQuery(sqls.userFromAuthToken, {
      $1: authToken,
    });
    return pgResp.rows[0] as UserModel;
  }

  async taskCreate({
    input,
    currentUser,
  }: {
    input: TaskInputModel;
    currentUser: UserModel;
  }): Promise<TaskPayloadModel> {
    const payload: TaskPayloadModel = {
      errors: [],
    };

    if (input.content.length < 15) {
      payload.errors.push({ message: "Text is too short" });
    }

    if (!payload.errors.length) {
      const pgResp = await this.pg.pgQuery(sqls.taskInsert, {
        $1: currentUser.id,
        $2: input.content,
        $3: input.tags.join(","),
        $4: input.isPrivate,
      });
      if (pgResp.rows[0]) payload.task = pgResp.rows[0] as TaskModel;
    }
    return payload;
  }
}
class PGAPIWrapper {
  constructor(private pg: PGDriver) {}

  async taskMainList(types: readonly string[]): Promise<TaskModel[][]> {
    const results = types.map(async (type) => {
      if (type !== "latest") throw new Error("Unsupported type");
      const pgResp = await this.pg.pgQuery(sqls.tasksLatest);
      return pgResp.rows as TaskModel[];
    });
    return Promise.all(results);
  }
  async userInfo(userIds: readonly string[]): Promise<UserModel[]> {
    const pgResp = await this.pg.pgQuery(sqls.usersFromIds, { $1: userIds });
    return userIds.map(
      (userId) => pgResp.rows.find((row) => row.id === userId) ?? null
    ) as UserModel[];
  }
  async approachList(tasksId: readonly string[]): Promise<ApproachModel[][]> {
    const pgResp = await this.pg.pgQuery(sqls.approachesForTaskIds, {
      $1: tasksId,
    });
    return tasksId.map((tasksId) =>
      pgResp.rows.filter((r) => r.id === tasksId)
    ) as ApproachModel[][];
  }
  async tasksInfo({
    tasksId,
    currentUser,
  }: {
    tasksId: readonly string[];
    currentUser: UserModel;
  }): Promise<TaskModel[]> {
    const pgResp = await this.pg.pgQuery(sqls.tasksFromIds, {
      $1: tasksId,
      $2: currentUser ? currentUser.id : null,
    });
    return tasksId.map((taskId) =>
      pgResp.rows.find((r) => r.id === +taskId)
    ) as TaskModel[];
  }
  async searchResults({
    searchTerms,
    currentUser,
  }: {
    searchTerms: readonly string[];
    currentUser: UserModel;
  }): Promise<(TaskModel | ApproachModel)[][]> {
    const results = searchTerms.map(async (term) => {
      const pgResp = await this.pg.pgQuery(sqls.searchResults, {
        $1: term,
        $2: currentUser ? currentUser.id : null,
      });
      return pgResp.rows as (TaskModel | ApproachModel)[];
    });
    return Promise.all(results);
  }

  async tasksForUsers(userIds: readonly string[]): Promise<TaskModel[][]> {
    const pgResp = await this.pg.pgQuery(sqls.tasksForUsers, {
      $1: userIds,
    });
    return userIds.map((userId) =>
      pgResp.rows.filter((task) => task.userId === userId)
    ) as TaskModel[][];
  }

  get mutators(): PGAPIWrapperMutations {
    const pgAPIWrapperMutations = new PGAPIWrapperMutations(this.pg);
    return pgAPIWrapperMutations;
  }
}
export default PGAPIWrapper;
