import { ModelSerializer } from "api_client/ModelSerializer";

export interface IIcon {
    id: number;
    name: string;
    imageUrl: string;
}

export class IconModel {
    id: number;
    name: string;
    imageUrl: string;

    constructor({id, name, imageUrl}: IIcon) {
        this.id = id;
        this.name = name;
        this.imageUrl = imageUrl;
    }
}

type RawIconModel = {
    id: number;
    name: string;
    imageUrl: string;
};

export class IconSerializer implements ModelSerializer<IconModel, RawIconModel> {
    serialize(obj: IconModel): RawIconModel {
        return {
            id: obj.id,
            name: obj.name,
            imageUrl: obj.imageUrl,
        };
    }

    deserialize(data: RawIconModel): IconModel {
        return {
            id: data.id,
            name: data.name,
            imageUrl: data.imageUrl,
        };
    }
}
