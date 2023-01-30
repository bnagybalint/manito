import urlcat from 'urlcat';

import { LoginResponseModel, LoginResponseSerializer } from 'api_client/model/LoginResponse';
import { TransactionModel, TransactionSerializer } from 'api_client/model/Transaction';
import { TransactionSearchParamsModel, TransactionSearchParamsSerializer } from 'api_client/model/TransactionSearchParams';
import { WalletModel, WalletSerializer } from 'api_client/model/Wallet';
import { CategoryModel, CategorySerializer } from 'api_client/model/Category';
import { IconModel, IconSerializer } from 'api_client/model/Icon';


type CheckResponseCallback = (res: Response) => Response;

type RequestParams = {
    // if 'json' defined, serializes the object with stringify, it overrides 'body' with it and sets content-type accordingly
    json?: object,
    body?: string,
    headers?: Record<string, string>,
};

export default class ApiClient {
    async loginWithGoogle(jwt: string): Promise<LoginResponseModel> {
        const url = '/api/login/google';
        return this.post(url, {json: {'jwt': jwt}})
            .then(res => this.checkResponse([200])(res))
            .then(res => res.json())
            .then(res => new LoginResponseSerializer().deserialize(res));
    }
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

    async createCategory(category: CategoryModel): Promise<CategoryModel> {
        const url = '/api/category/create';
        return this.post(url, {json: new CategorySerializer().serialize(category)})
            .then(res => this.checkResponse([200])(res))
            .then(res => res.json())
            .then(res => new CategorySerializer().deserialize(res));
    }

    async updateCategory(category: CategoryModel): Promise<CategoryModel> {
        const url = urlcat('/api/category/:id', {id: category.id!});
        return this.patch(url, {json: new CategorySerializer().serialize(category)})
            .then(res => this.checkResponse([200])(res))
            .then(res => res.json())
            .then(res => new CategorySerializer().deserialize(res))
    }

    async deleteCategory(categoryId: number): Promise<void> {
        const url = urlcat('/api/category/:id', {id: categoryId});
        this.delete(url)
            .then(res => this.checkResponse([204])(res))
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

    async updateTransaction(transaction: TransactionModel): Promise<TransactionModel> {
        const url = urlcat('/api/transaction/:id', {id: transaction.id!});

        return this.patch(url, {json: new TransactionSerializer().serialize(transaction)})
            .then(res => this.checkResponse([200])(res))
            .then(res => res.json())
            .then(res => new TransactionSerializer().deserialize(res))
    }

    async deleteTransaction(transactionId: number): Promise<void> {
        const url = urlcat('/api/transaction/:id', {id: transactionId});
        this.delete(url)
            .then(res => this.checkResponse([204])(res))
    }

    async getIcons(): Promise<IconModel[]> {
        const url = '/api/icons';
        return this.get(url)
            .then(res => this.checkResponse([200])(res))
            .then(res => res.json())
            .then(res => res.map((p: any) => new IconSerializer().deserialize(p)));
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

    async patch(url: string, req?: RequestParams): Promise<Response> {
        return this.request(url, 'PATCH', req);
    }

    async request(url: string, method: 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH', req?: RequestParams): Promise<Response> {
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
