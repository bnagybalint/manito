import { Category } from 'entity/Category';

export class Transaction {
    id: number;
    time: Date;
    category: Category;
    note: string | null;
    amount: number;

    constructor(
        id: number,
        time: Date,
        category: Category,
        note: string | null,
        amount: number,
    ) {
        this.id = id;
        this.time = time;
        this.category = category;
        this.note = note;
        this.amount = amount;
    }
}
