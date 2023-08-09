import { QueryResult, Pool, QueryResultRow } from "pg";
import pgClient from "./pg-client";
import sqls from "./sqls";
import TaskModel from "../models/TaskModel";
import UserModel from "../models/UserModel";
import ApproachModel from "../models/ApproachModel";

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
  async tasksInfo(tasksId: readonly string[]): Promise<TaskModel[]> {
    const pgResp = await this.pg.pgQuery(sqls.tasksFromIds, {
      $1: tasksId,
      $2: null,
    });
    return tasksId.map((taskId) =>
      pgResp.rows.find((r) => r.id === +taskId)
    ) as TaskModel[];
  }
  async searchResults(
    searchTerms: readonly string[]
  ): Promise<(TaskModel | ApproachModel)[][]> {
    const results = searchTerms.map(async (term) => {
      const pgResp = await this.pg.pgQuery(sqls.searchResults, {
        $1: term,
        $2: null,
      });
      return pgResp.rows as (TaskModel | ApproachModel)[];
    });
    return Promise.all(results);
  }
}
export default PGAPIWrapper;
