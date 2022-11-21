import { ModelSerializer } from "api_client/ModelSerializer";
import { dateFromISOString, dateToISOString } from "common/dateFormat";


export interface IWallet {
    id: number;
    name: string;
    ownerId: number;
    createdAt?: Date;
    deletedAt?: Date;
};

export class WalletModel {
    id: number;
    name: string;
    ownerId: number;
    createdAt?: Date;
    deletedAt?: Date;

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
            createdAt: obj.createdAt ? dateToISOString(obj.createdAt) : undefined,
            deletedAt: obj.deletedAt ? dateToISOString(obj.deletedAt) : undefined,
        }
    }

    deserialize(data: RawWalletModel): WalletModel {
        return {
            id: data.id,
            name: data.name,
            ownerId: data.ownerId,
            createdAt: data.createdAt ? dateFromISOString(data.createdAt) : undefined,
            deletedAt: data.deletedAt ? dateFromISOString(data.deletedAt) : undefined,
        }
    }
}
