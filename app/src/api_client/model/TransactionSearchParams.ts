import moment from "moment";
import { ModelSerializer } from "api_client/ModelSerializer";


export interface ITransactionSearchParams {
    maxAmount?: number;
    minAmount?: number;
    searchString?: string;
    endDate?: moment.Moment;
    startDate?: moment.Moment;
    walletId: number;
}

export class TransactionSearchParamsModel {
    maxAmount?: number;
    minAmount?: number;
    searchString?: string;
    endDate?: moment.Moment;
    startDate?: moment.Moment;
    walletId: number;

    constructor({maxAmount, minAmount, searchString, endDate, startDate, walletId}: ITransactionSearchParams) {
        this.maxAmount = maxAmount;
        this.minAmount = minAmount;
        this.searchString = searchString;
        this.endDate = endDate;
        this.startDate = startDate;
        this.walletId = walletId;
    }
}

type RawTransactionSearchParamsModel = {
    maxAmount?: number;
    minAmount?: number;
    searchString?: string;
    endDate?: string;
    startDate?: string;
    walletId: number;
}

export class TransactionSearchParamsSerializer implements ModelSerializer<TransactionSearchParamsModel, RawTransactionSearchParamsModel> {
    serialize(obj: TransactionSearchParamsModel): RawTransactionSearchParamsModel {
        return {
            maxAmount: obj.maxAmount,
            minAmount: obj.minAmount,
            searchString: obj.searchString,
            endDate: obj.endDate?.format(moment.HTML5_FMT.DATE),
            startDate: obj.startDate?.format(moment.HTML5_FMT.DATE),
            walletId: obj.walletId,
        }
    }

    deserialize(data: RawTransactionSearchParamsModel): TransactionSearchParamsModel {
        throw Error('unimplemented');
    }
}
