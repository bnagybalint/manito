import moment from "moment";
import { ModelSerializer } from "api_client/ModelSerializer";


export interface IWallet {
    id: number;
    name: string;
    ownerId: number;
    createdAt?: moment.Moment;
    deletedAt?: moment.Moment;
};

export class WalletModel {
    id: number;
    name: string;
    ownerId: number;
    createdAt?: moment.Moment;
    deletedAt?: moment.Moment;

    constructor({id, name, ownerId, createdAt, deletedAt}: IWallet) {
        this.id = id;
        this.name = name;
        this.ownerId = ownerId;
        this.createdAt = createdAt;
        this.deletedAt = deletedAt;
    }

};

type RawWalletModel = {
    id: number;
    name: string;
    ownerId: number;
    createdAt?: string;
    deletedAt?: string;
}

export class WalletSerializer implements ModelSerializer<WalletModel, RawWalletModel> {
    serialize(obj: WalletModel): RawWalletModel {
        return {
            id: obj.id,
            name: obj.name,
            ownerId: obj.ownerId,
            createdAt: obj.createdAt?.toISOString(),
            deletedAt: obj.deletedAt?.toISOString(),
        }
    }

    deserialize(data: RawWalletModel): WalletModel {
        return {
            id: data.id,
            name: data.name,
            ownerId: data.ownerId,
            createdAt: data.createdAt ? moment(data.createdAt, moment.ISO_8601) : undefined,
            deletedAt: data.deletedAt ? moment(data.deletedAt, moment.ISO_8601) : undefined,
        }
    }
}
