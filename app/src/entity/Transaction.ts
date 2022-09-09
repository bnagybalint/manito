import Category from 'entity/Category';

export default interface Transaction {
    id: number;
    time: Date;
    category: Category;
    note?: string;
    amount: number;
}
