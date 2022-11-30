import urlcat from 'urlcat';

import { TransactionModel, TransactionSerializer } from 'api_client/model/Transaction';
import { TransactionSearchParamsModel, TransactionSearchParamsSerializer } from 'api_client/model/TransactionSearchParams';
import { WalletModel, WalletSerializer } from 'api_client/model/Wallet';
import { CategoryModel, CategorySerializer } from 'api_client/model/Category';


type CheckResponseCallback = (res: Response) => Response;

type RequestParams = {
    // if 'json' defined, serializes the object with stringify, it overrides 'body' with it and sets content-type accordingly
    json?: object,
    body?: string,
    headers?: Record<string, string>,
};

export default class ApiClient {
    async getWallets(userId: number): Promise<WalletModel[]> {
        const url = urlcat('/api/user/:id/wallets', {id: userId});
        return this.get(url)
            .then(res => this.checkResponse([200])(res))
            .then(res => res.json())
            .then(res => res.map((p: any) => new WalletSerializer().deserialize(p)))
    }

    async getCategories(userId: number): Promise<CategoryModel[]> {
        const url = urlcat('/api/user/:id/categories', {id: userId});
        return this.get(url)
            .then(res => this.checkResponse([200])(res))
            .then(res => res.json())
            .then(res => res.map((p: any) => new CategorySerializer().deserialize(p)));
    }

    async getTransactions(searchParams: TransactionSearchParamsModel): Promise<TransactionModel[]> {
        const url = '/api/transaction/search';
        return this.post(url, {json: new TransactionSearchParamsSerializer().serialize(searchParams)})
            .then(res => this.checkResponse([200])(res))
            .then(res => res.json())
            .then(res => res.map((p: any) => new TransactionSerializer().deserialize(p)));
    }

    async createTransaction(transaction: TransactionModel): Promise<TransactionModel> {
        const url = '/api/transaction/create';
        return this.post(url, {json: new TransactionSerializer().serialize(transaction)})
            .then(res => this.checkResponse([200])(res))
            .then(res => res.json())
            .then(res => new TransactionSerializer().deserialize(res));
    }

    async deleteTransaction(transactionId: number): Promise<void> {
        const url = urlcat('/api/transaction/:id', {id: transactionId});
        this.delete(url)
            .then(res => this.checkResponse([204])(res))
    }

    async get(url: string, req?: RequestParams): Promise<Response> {
        return this.request(url, 'GET', req);
    }

    async post(url: string, req?: RequestParams): Promise<Response> {
        return this.request(url, 'POST', req);
    }

    async delete(url: string, req?: RequestParams): Promise<Response> {
        return this.request(url, 'DELETE', req);
    }

    async request(url: string, method: 'GET' | 'POST' | 'DELETE', req?: RequestParams): Promise<Response> {
        let headers = req?.headers;
        let body = req?.body;
        if(req?.json !== undefined) {
            headers = {...headers, 'Content-Type': 'application/json'};
            body = JSON.stringify(req.json);
        }

        return fetch(url, {
            method: method,
            headers: {...headers},
            body: body,
            mode: 'cors',
        });
    }

    api_url(): string {
        const url = process.env.REACT_APP_API_URL;
        if(!url) {
            throw new Error('API URL missing!');
        }

        return url;
    }

    checkResponse(acceptedCodes: number[]): CheckResponseCallback {
        const impl = (res: Response): Response => {
            if(!acceptedCodes.includes(res.status)) {
                throw new Error(`API request to ${res.url} returned with status ${res.status}`);
            }
            return res;
        }
        return impl;
    }
}
