import ApproachModel from "./ApproachModel";
import UserErroModel from "./UserErrorModel";

export type ApproachInputModel = {
    content: string;
    detailList: ApproachDetailInputModel[];
};

export type ApproachDetailInputModel = {
    content: string;
    category: EnumCategories;
};

export enum EnumCategories {
    NOTE = "NOTE",
    EXPLANATION = "EXPLANATION",
    WARNING = "WARNING",
}
// export type ApproachDetailCategoryModel = Record<keyof EnumCategories, any>;

export type ApproachPayloadModel = {
    errors: UserErroModel[];
    approach?: ApproachModel;
};
