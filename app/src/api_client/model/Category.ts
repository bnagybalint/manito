import moment from "moment";
import { ModelSerializer } from "api_client/ModelSerializer";


export interface ICategory {
    id?: number;
    createdAt?: moment.Moment;
    ownerId: number;
    name: string;
    iconUrl: string;
}

export class CategoryModel {
    id?: number;
    createdAt?: moment.Moment;
    ownerId: number;
    name: string;
    iconUrl: string;

    constructor({id, createdAt, ownerId, name, iconUrl}: ICategory) {
        this.id = id;
        this.createdAt = createdAt;
        this.ownerId = ownerId;
        this.name = name;
        this.iconUrl = iconUrl;
    }
}

type RawCategoryModel = {
    id?: number;
    createdAt?: string;
    ownerId: number;
    name: string;
    iconUrl: string;
};

export class CategorySerializer implements ModelSerializer<CategoryModel, RawCategoryModel> {
    serialize(obj: CategoryModel): RawCategoryModel {
        return {
            id: obj.id,
            createdAt: obj.createdAt?.toISOString(),
            ownerId: obj.ownerId,
            name: obj.name,
            iconUrl: obj.iconUrl,
        };
    }

    deserialize(data: RawCategoryModel): CategoryModel {
        return {
            id: data.id,
            createdAt: data.createdAt ? moment.utc(data.createdAt, moment.ISO_8601) : undefined,
            ownerId: data.ownerId,
            name: data.name,
            iconUrl: data.iconUrl,
        };
    }
}
