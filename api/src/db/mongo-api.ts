import * as mongo from "mongodb";
import mongoClient from "./mongo-client";
import ApproachDetailModel from "../models/ApproachDetailModel";

export class MongoDriver {
  public mdb: mongo.Db | null = null;
  async init() {
    const { mdb } = await mongoClient();
    this.mdb = mdb;
  }

  findDocumentByField({
    collectionName,
    fieldName,
    fieldValues,
  }: {
    collectionName: string;
    fieldName: string;
    fieldValues: readonly string[];
  }) {
    if (!this.mdb) throw new Error("ERROR MONGODB");
    return this.mdb
      .collection(collectionName)
      .find({ [fieldName]: { $in: fieldValues } })
      .toArray();
  }
}
class MongoApiWrapper {
  constructor(private mongoService: MongoDriver) {}

  async detailList(
    approachIds: readonly string[]
  ): Promise<ApproachDetailModel[][]> {
    const mongoDocuments = await this.mongoService.findDocumentByField({
      collectionName: "approachDetails",
      fieldName: "pgId",
      fieldValues: approachIds,
    });
    const results = approachIds.map((approachId) => {
      const approachDoc = mongoDocuments.find((doc) => doc.pgId === approachId);
      if (!approachDoc) return [];
      const { explanations, notes, warnings } = approachDoc;

      const approachDetails: { content: string; category: string }[] = [];
      if (explanations) {
        approachDetails.push(
          ...explanations.map((element: string) => ({
            content: element,
            category: "EXPLANATION",
          }))
        );
      }
      if (notes) {
        approachDetails.push(
          ...notes.map((element: string) => ({
            content: element,
            category: "NOTE",
          }))
        );
      }
      if (warnings) {
        approachDetails.push(
          ...warnings.map((element: string) => ({
            content: element,
            category: "WARNING",
          }))
        );
      }
      return approachDetails as ApproachDetailModel[];
    });
    return Promise.all(results);
  }
}
export default MongoApiWrapper;
