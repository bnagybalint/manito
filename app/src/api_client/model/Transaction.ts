import { ModelSerializer } from "api_client/ModelSerializer";
import { dateFromISOString, dateToISOString } from "common/dateFormat";


export interface ITransaction {
    id?: number;
    time: Date;
    amount: number;
    categoryId?: number;
    notes?: string;
    sourceWalletId?: number;
    destinationWalletId?: number;
}

export class TransactionModel {
    id?: number;
    time: Date;
    amount: number;
    categoryId?: number;
    notes?: string;
    sourceWalletId?: number;
    destinationWalletId?: number;

    constructor({id, time, categoryId, notes, amount, sourceWalletId, destinationWalletId}: ITransaction) {
        this.id = id;
        this.time = time;
        this.categoryId = categoryId;
        this.notes = notes;
        this.amount = amount;
        this.sourceWalletId = sourceWalletId;
        this.destinationWalletId = destinationWalletId;
    }
}

type RawTransactionModel = {
    id?: number;
    time: string;
    amount: number;
    categoryId?: number;
    notes?: string;
    sourceWalletId?: number;
    destinationWalletId?: number;
}

export class TransactionSerializer implements ModelSerializer<TransactionModel, RawTransactionModel> {
    serialize(obj: TransactionModel): RawTransactionModel {
        return {
            id: obj.id,
            time: dateToISOString(obj.time),
            categoryId: obj.categoryId,
            notes: obj.notes,
            amount: obj.amount,
            sourceWalletId: obj.sourceWalletId,
            destinationWalletId: obj.destinationWalletId,
        }
    }

    deserialize(data: RawTransactionModel): TransactionModel {
        return {
            id: data.id,
            time: dateFromISOString(data.time),
            categoryId: data.categoryId,
            notes: data.notes,
            amount: data.amount,
            sourceWalletId: data.sourceWalletId,
            destinationWalletId: data.destinationWalletId,
        }
    }
}
