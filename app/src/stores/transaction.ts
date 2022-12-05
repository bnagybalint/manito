import create from 'zustand';
import moment from 'moment';
import produce from 'immer';

import ApiClient from 'api_client/ApiClient'
import { TransactionSearchParamsModel } from 'api_client/model/TransactionSearchParams'

import Transaction from 'entity/Transaction'
import Wallet from 'entity/Wallet';


interface State {
    transactions: Transaction[];

    loaded: boolean;
    error: string | null;
}

interface Actions {
    fetchTransactions: (walletId: number) => void;
    addTransaction: (transaction: Transaction) => void;
    deleteTransactionById: (transactionId: number) => void;
    updateTransaction: (transaction: Transaction) => void;
}

export type TransactionState = State & Actions;

export const useTransactionStore = create<TransactionState>((set, get) => ({
    transactions: [],
    loaded: false,
    error: null,

    fetchTransactions: (walletId: number) => {
        const state = get();
        if(state.loaded || state.error) {
            // already loaded
            return;
        }

        const client = new ApiClient();
        client.getTransactions(new TransactionSearchParamsModel({walletId: walletId}))
            .then((ts) => ts.map((t) => new Transaction(t)))
            .then((transactions) => set({
                transactions: transactions,
                loaded: true
            }))
            .catch((error: Error) => set({error: error.message}));
    },

    addTransaction: (transaction: Transaction) => {
        const client = new ApiClient();
        client.createTransaction(transaction)
            .then((t) => new Transaction(t))
            .then((newTransaction) => set(produce((draft: State) => {
                draft.transactions.push(newTransaction);
            })))
            .catch((error: Error) => set({error: error.message}));
    },

    updateTransaction: (transaction: Transaction) => {
        const client = new ApiClient();
        client.updateTransaction(transaction)
            .then((t) => new Transaction(t))
            .then((updatedTransaction) => {
                set(produce((draft: State) => {
                    const idx = draft.transactions.findIndex((t: Transaction) => t.id === transaction.id);
                    draft.transactions.splice(idx, 1, updatedTransaction);
                }))
            })
            .catch((error: Error) => set({error: error.message}));
    },

    deleteTransactionById: (transactionId: number) => {
        const client = new ApiClient();
        client.deleteTransaction(transactionId)
            .then(() => set({
                transactions: get().transactions.filter((t: Transaction) => t.id !== transactionId)
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
            (!filters.wallet || filters.wallet.id === x.sourceWalletId || filters.wallet.id === x.destinationWalletId)
            && (!filters.startDate || moment(x.time).local().isSameOrAfter(filters.startDate, 'day'))
            && (!filters.endDate || moment(x.time).local().isSameOrBefore(filters.endDate, 'day'))
            && (!filters.searchString || x.notes?.toLowerCase()?.includes(filters.searchString.toLocaleLowerCase()))
        ))
    }

    return impl;
}
