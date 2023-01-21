import { ModelSerializer } from "api_client/ModelSerializer";


export interface IUser {
    id: number;
    name: string;
}

export class UserModel {
    id: number;
    name: string;

    constructor({id, name}: IUser) {
        this.id = id;
        this.name = name;
    }
}

type RawUserModel = IUser;

export class UserSerializer implements ModelSerializer<UserModel, RawUserModel> {
    serialize(obj: UserModel): RawUserModel {
        return obj;
    }

    deserialize(data: RawUserModel): UserModel {
        return data;
    }
}
