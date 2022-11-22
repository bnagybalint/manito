import moment from "moment";
import { ModelSerializer } from "api_client/ModelSerializer";


export interface ICategory {
    id: number;
    createdAt?: moment.Moment;
    name: string;
    iconUrl: string;
}

export class CategoryModel {
    id: number;
    createdAt?: moment.Moment;
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
    createdAt?: string;
    name: string;
    iconUrl: string;
};

export class CategorySerializer implements ModelSerializer<CategoryModel, RawCategoryModel> {
    serialize(obj: CategoryModel): RawCategoryModel {
        return {
            id: obj.id,
            createdAt: obj.createdAt?.toISOString(),
            name: obj.name,
            iconUrl: obj.iconUrl,
        };
    }

    deserialize(data: RawCategoryModel): CategoryModel {
        return {
            id: data.id,
            createdAt: data.createdAt ? moment(data.createdAt, moment.ISO_8601) : undefined,
            name: data.name,
            iconUrl: data.iconUrl,
        };
    }
}
