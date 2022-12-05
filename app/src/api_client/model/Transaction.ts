import moment from 'moment';
import { ModelSerializer } from "api_client/ModelSerializer";


export interface ITransaction {
    id?: number;
    time: moment.Moment;
    amount: number;
    categoryId?: number;
    notes?: string;
    sourceWalletId?: number;
    destinationWalletId?: number;
}

export class TransactionModel {
    id?: number;
    time: moment.Moment;
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
            time: obj.time.toISOString(),
            categoryId: obj.categoryId,
            notes: obj.notes,
            amount: obj.amount,
            sourceWalletId: obj.sourceWalletId,
            destinationWalletId: obj.destinationWalletId,
        }
    }

    deserialize(data: RawTransactionModel): TransactionModel {
        const r =  {
            id: data.id,
            time: moment.utc(data.time, moment.ISO_8601),
            categoryId: data.categoryId,
            notes: data.notes,
            amount: data.amount,
            sourceWalletId: data.sourceWalletId,
            destinationWalletId: data.destinationWalletId,
        }
        return r;
    }
}
