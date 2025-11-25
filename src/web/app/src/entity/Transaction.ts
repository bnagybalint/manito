import { TransactionModel } from 'api_client/model/Transaction';
import Category from 'entity/Category';
import Wallet from 'entity/Wallet';


export type TransactionType = 'income' | 'expense' | 'transfer';

export default class Transaction extends TransactionModel {
    category?: Category;
    src_wallet?: Wallet;
    dst_wallet?: Wallet;

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