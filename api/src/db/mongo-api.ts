import * as mongo from "mongodb";
import mongoClient from "./mongo-client";
import ApproachDetailModel from "../models/ApproachDetailModel";
import { ApproachDetailInputModel, EnumCategories } from "../models/ApproachInput";

export class MongoDriver {
    public mdb: mongo.Db | null = null;
    async init() {
        const { mdb } = await mongoClient();
        this.mdb = mdb;
    }

    findDocumentByField({ collectionName, fieldName, fieldValues }: { collectionName: string; fieldName: string; fieldValues: readonly string[] }) {
        if (!this.mdb) throw new Error("ERROR MONGODB");
        return this.mdb
            .collection(collectionName)
            .find({ [fieldName]: { $in: fieldValues } })
            .toArray();
    }
}
class MongoApiWrapper {
    constructor(private mongoService: MongoDriver) {}

    async detailList(approachIds: readonly string[]): Promise<ApproachDetailModel[][]> {
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
                        category: "explanations",
                    }))
                );
            }
            if (notes) {
                approachDetails.push(
                    ...notes.map((element: string) => ({
                        content: element,
                        category: "notes",
                    }))
                );
            }
            if (warnings) {
                approachDetails.push(
                    ...warnings.map((element: string) => ({
                        content: element,
                        category: "warnings",
                    }))
                );
            }
            return approachDetails as ApproachDetailModel[];
        });
        return Promise.all(results);
    }

    get mutators(): MongoAPIWrapperMutations {
        const mongoAPIWrapperMutations = new MongoAPIWrapperMutations(this.mongoService);
        return mongoAPIWrapperMutations;
    }
}

export class MongoAPIWrapperMutations {
    constructor(private mongoService: MongoDriver) {}
    async approachDetailCreate(approachId: number, detailsInput: ApproachDetailInputModel[]) {
        const details: Partial<Record<keyof EnumCategories, string[]>> = {};

        detailsInput.forEach(({ category, content }) => {
            if (details[category as any] === undefined) details[category as any] = [];
            details[category as any]?.push(content);
        });
        return await this.mongoService.mdb!.collection("approachDetails").insertOne({
            pgId: approachId,
            ...details,
        });
    }
}

export default MongoApiWrapper;
