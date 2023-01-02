import moment from "moment";
import { ModelSerializer } from "api_client/ModelSerializer";

export interface ICategory {
    id?: number;
    createdAt?: moment.Moment;
    ownerId: number;
    name: string;
    iconId: number;
    iconColor: string;
}

export class CategoryModel {
    id?: number;
    createdAt?: moment.Moment;
    ownerId: number;
    name: string;
    iconId: number;
    iconColor: string;

    constructor({id, createdAt, ownerId, name, iconId, iconColor}: ICategory) {
        this.id = id;
        this.createdAt = createdAt;
        this.ownerId = ownerId;
        this.name = name;
        this.iconId = iconId;
        this.iconColor = iconColor;
    }
}

type RawCategoryModel = {
    id?: number;
    createdAt?: string;
    ownerId: number;
    name: string;
    iconId: number;
    iconColor: string;
};

export class CategorySerializer implements ModelSerializer<CategoryModel, RawCategoryModel> {
    serialize(obj: CategoryModel): RawCategoryModel {
        return {
            id: obj.id,
            createdAt: obj.createdAt?.toISOString(),
            ownerId: obj.ownerId,
            name: obj.name,
            iconId: obj.iconId,
            iconColor: obj.iconColor,
        };
    }

    deserialize(data: RawCategoryModel): CategoryModel {
        return {
            id: data.id,
            createdAt: data.createdAt ? moment.utc(data.createdAt, moment.ISO_8601) : undefined,
            ownerId: data.ownerId,
            name: data.name,
            iconId: data.iconId,
            iconColor: data.iconColor,
        };
    }
}
