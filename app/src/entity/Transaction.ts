import dateFormat from 'dateformat';
import moment from 'moment';

import { TransactionModel } from 'api_client/model/Transaction';


export default class Transaction extends TransactionModel {
    public getSignedAmount(walletId: number): number {
        return (this.sourceWalletId == walletId) ? -this.amount : this.amount;
    }
}