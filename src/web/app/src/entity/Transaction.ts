import { TransactionModel } from 'api_client/model/Transaction';


export type TransactionType = 'income' | 'expense' | 'transfer';

export default class Transaction extends TransactionModel {
    public getSignedAmount(walletId: number): number {
        return (this.sourceWalletId === walletId) ? -this.amount : this.amount;
    }

    public getTransactionType(walletId: number): TransactionType {
        if(this.sourceWalletId === undefined) {
            return 'income';
        }
        if(this.destinationWalletId === undefined) {
            return 'expense';
        }
        return 'transfer'
    }
}