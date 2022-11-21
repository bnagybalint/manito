import { ModelSerializer } from "api_client/ModelSerializer";
import { dateFromISOString, dateToISOString } from "common/dateFormat";


export interface ICategory {
    id: number;
    createdAt: Date;
    name: string;
    iconUrl: string;
}

export class CategoryModel {
    id: number;
    createdAt: Date;
    name: string;
    iconUrl: string;

    constructor({id, createdAt, name, iconUrl}: ICategory) {
        this.id = id;
        this.createdAt = createdAt;
        this.name = name;
        this.iconUrl = iconUrl;
    }
}

type RawCategoryModel = {
    id: number;
    createdAt: string;
    name: string;
    iconUrl: string;
};

export class CategorySerializer implements ModelSerializer<CategoryModel, RawCategoryModel> {
    serialize(obj: CategoryModel): RawCategoryModel {
        return {
            id: obj.id,
            createdAt: dateToISOString(obj.createdAt),
            name: obj.name,
            iconUrl: obj.iconUrl,
        };
    }

    deserialize(data: RawCategoryModel): CategoryModel {
        return {
            id: data.id,
            createdAt: dateFromISOString(data.createdAt),
            name: data.name,
            iconUrl: data.iconUrl,
        };
    }
}
