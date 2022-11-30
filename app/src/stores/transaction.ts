import create from 'zustand';
import moment from 'moment';

import { ITransaction } from 'api_client/model/Transaction';
import ApiClient from 'api_client/ApiClient'
import Transaction from 'entity/Transaction'
import Wallet from 'entity/Wallet';
import { TransactionSearchParamsModel } from 'api_client/model/TransactionSearchParams'


interface State {
    transactions: Transaction[];

    loaded: boolean;
    error: string | null;
}

interface Actions {
    fetchTransactions: (walletId: number) => void;
    addTransaction: (transaction: ITransaction) => void;
    deleteTransaction: (transaction: Transaction) => void;
}

export type TransactionState = State & Actions;

export const useTransactionStore = create<TransactionState>((set, get) => ({
    transactions: [],
    loaded: false,
    error: null,

    fetchTransactions: (walletId: number) => {
        const client = new ApiClient();
        client.getTransactions(new TransactionSearchParamsModel({walletId: walletId}))
            .then((ts) => ts.map((t) => new Transaction(t)))
            .then((transactions) => set({
                transactions: transactions,
                loaded: true
            }))
            .catch((error: Error) => set({error: error.message}));
    },

    addTransaction: (transaction: ITransaction) => {
        const client = new ApiClient();
        client.createTransaction(transaction)
            .then((t) => new Transaction(t))
            .then((newTransaction) => set({
                transactions: [...get().transactions, newTransaction],
            }))
            .catch((error: Error) => set({error: error.message}));
    },

    deleteTransaction: (transaction: Transaction) => {
        const client = new ApiClient();
        client.deleteTransaction(transaction.id!)
            .then(() => set({
                transactions: get().transactions.filter((t: Transaction) => t.id != transaction.id)
            }))
            .catch((error: Error) => set({error: error.message}));
    },
}));

export const selectAllTransactions = (state: TransactionState) => state.transactions;

type TransactionFilters = {
    wallet?: Wallet,
    startDate?: moment.Moment,
    endDate?: moment.Moment,
    searchString?: string,
};

export const selectFilteredTransactions = (filters: TransactionFilters) => {
    const impl = (state: TransactionState) => {
        return state.transactions.filter((x) => (
            (!filters.wallet || filters.wallet.id == x.sourceWalletId || filters.wallet.id == x.destinationWalletId)
            && (!filters.startDate || x.time.isSameOrAfter(filters.startDate, 'day'))
            && (!filters.endDate || x.time.isSameOrBefore(filters.endDate, 'day'))
            && (!filters.searchString || x.notes?.includes(filters.searchString))
        ))
    }

    return impl;
}
