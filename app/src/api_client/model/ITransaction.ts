import ICategory from 'api_client/model/ICategory';

export default interface ITransaction {
    id: number;
    time: Date;
    amount: number;
    category: ICategory;
    description?: string;
    sourceWalletId?: number;
    destinationWalletId?: number;
}
