import ITransaction from 'api_client/model/ITransaction';

import Category from 'entity/Category';

export default class Transaction {
    id: number;
    time: Date;
    amount: number;
    category: Category;
    notes?: string;
    sourceWalletId?: number;
    destinationWalletId?: number;

    constructor({id, time, category, notes, amount, sourceWalletId, destinationWalletId}: ITransaction) {
        this.id = id;
        this.time = time;
        this.category = category;
        this.notes = notes;
        this.amount = amount;
        this.sourceWalletId = sourceWalletId;
        this.destinationWalletId = destinationWalletId;
    }

    public getSignedAmount(walletId: number): number {
        return (this.sourceWalletId == walletId) ? -this.amount : this.amount;
    }
}