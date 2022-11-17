import ITransaction from 'api_client/model/ITransaction';
import Transaction from 'entity/Transaction';
import Wallet from 'entity/Wallet';
import urlcat from 'urlcat';

type CheckResponseCallback = (res: Response) => Response;

export interface TransactionSearchFilter {
    startDate?: Date,
    endDate?: Date,
    searchString?: string,
};

type RequestParams = {
    // if 'json' defined, serializes the object with stringify, it overrides 'body' with it and sets content-type accordingly
    json?: object,
    body?: string,
    headers?: Record<string, string>,
};

function toISODateString(dt: Date): string {
    /**
     * Returns the date part of the Date object to an ISO 8601 string.
     * 
     * @param dt The input date
     * @returns The date part of the input, ISO 8601 formatted.
     */
     return dt.toISOString().substring(0, 10);
}

function removeTimeZoneOffset(dt: Date): Date {
    /**
     * Removes the the timezone offset from a Date, to get a Date object with the same clock value
     * but in GMT+0. Example: 2022-09-31T00:00:00+02:00 (midnight in GMT+2) becomes
     * 2022-09-31T00:00:00+00:00 (midnight in GMT+0).
     * 
     * Motivation:
     *  let dt = new Date(2022,0,1); // 2022-01-01T00:00:00+XXXX
     *  dt = removeTimeZoneOffset(dt);
     *  dt.toISOString() // now always returns 2022-01-01
     * 
     * @param dt The date to remove the ofset from
     * @returns The date with the same clock value, but in GMT+0
     */
    return new Date(dt.valueOf() - dt.getTimezoneOffset() * 60 * 1000);
}

export default class ApiClient {
    async getWallets(userId: number): Promise<Wallet[]> {
        const url = urlcat('/api/user/:id/wallets', {id: userId});
        return this.get(url)
            .then(res => this.checkResponse([200])(res))
            .then(res => res.json())
            .catch(error => console.error(`Failed to fetch: ${error}`))
    }

    async getTransactions(walletId: number, filters?: TransactionSearchFilter): Promise<Transaction[]> {
        const url = '/api/transaction/search';
        const data = {
            walletId: walletId,
            searchString: filters?.searchString, 
            startDate: filters?.startDate ? toISODateString(removeTimeZoneOffset(filters?.startDate)) : undefined,
            endDate: filters?.endDate ? toISODateString(removeTimeZoneOffset(filters?.endDate)) : undefined,
        };

        return this.post(url, {json: data})
            .then(res => this.checkResponse([200])(res))
            .then(res => res.json())
            .then(res => res.map((p: ITransaction) => new Transaction(p)));
    }

    async createTransaction(transaction: ITransaction): Promise<Transaction> {
        const url = '/api/transaction/create';
        return this.post(url, {json: transaction})
            .then(res => this.checkResponse([200])(res))
            .then(res => res.json())
            // TODO maybe this endpoint should return the freshly created entity's details
            .then(id => new Transaction({...transaction, id: id}));
    }

    async get(url: string, req?: RequestParams): Promise<Response> {
        return this.request(url, 'GET', req);
    }

    async post(url: string, req?: RequestParams): Promise<Response> {
        return this.request(url, 'POST', req);
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
