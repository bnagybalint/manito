import moment from 'moment';
import { parseCsv, Options } from 'util/CsvReader';

import Transaction from 'entity/Transaction';
import Category from 'entity/Category';

export enum ColumnSemantics {
    TIME,
    AMOUNT,
    CATEGORY,
    NOTES,
    IGNORE,
}

export interface ColumnDefinition {
    // Name of the column
    name: string;
    // Semantics of the column, what is stored in it
    semantics: ColumnSemantics,
    // In case of AMOUNT column, the ID of the associated wallet
    walletId?: number;
}

interface LoadOptions {
    delimiter?: string;
    hasHeader?: boolean;
}

export class CsvTransactionImporter {
    columns: ColumnDefinition[];
    columnsByName: Map<string, ColumnDefinition>;
    categories: Category[];
    categoriesByName: Map<string, Category>;

    timeColumnIndex: number;
    notesColumnIndex: number | undefined;
    categoryColumnIndex: number;
    amountColumnIndices: number[];

    public constructor(columns: ColumnDefinition[], categories: Category[]) {
        this.columns = columns;
        this.columnsByName = new Map(columns.map((x) => [x.name, x]));
        this.categories = categories;
        this.categoriesByName = new Map(categories.map((x) => [x.name, x]));

        this.verifyColumns();

        this.timeColumnIndex = this.getColumnIndex(ColumnSemantics.TIME)!;
        this.notesColumnIndex = this.getColumnIndex(ColumnSemantics.NOTES);
        this.categoryColumnIndex = this.getColumnIndex(ColumnSemantics.CATEGORY)!;
        this.amountColumnIndices = this.getColumnIndices(ColumnSemantics.AMOUNT);
    }

    public loadFromString(csv: string, options?: LoadOptions): Transaction[] {
        const csvOptions: Options = {
            delimiter: options?.delimiter ?? ';',
            hasHeader: options?.hasHeader ?? true,
            omitHeader: options?.hasHeader ?? true,
            ltrim: true,
            rtrim: true,
        };

        const records = parseCsv(csv, csvOptions);
        
        const transactions: Transaction[] = records.map((recordRaw: string[], recordIndex: number) => {
            try {
                if (recordRaw.length != this.columns.length) {
                    throw new Error(`Length of record (${recordRaw.length}) does not match that of column definitions (${this.columns.length}).`);
                }
        
                const record = this.parseRecord(recordRaw);
                const transaction = this.parseTransactionFromRecord(record);
                return new Transaction(transaction);
                
            } catch(error) {
                const errorMessage = (error instanceof Error) ? error.message : String(error);
                throw new Error(`Failed to parse record #${recordIndex}: ${errorMessage}`);
            }
        });

        return transactions;
    }

    private verifyColumns() {
        if (this.getColumnIndices(ColumnSemantics.TIME).length != 1) {
            throw new Error('Invalid column definitions: no/multiple TIME columns defined');
        }
        if (this.getColumnIndices(ColumnSemantics.CATEGORY).length != 1) {
            throw new Error('Invalid column definitions: no/multiple CATEGORY columns defined');
        }

        const amountColumns = this.columns.filter((x) => x.semantics == ColumnSemantics.AMOUNT);
        if (amountColumns.length < 1) {
            throw new Error('Invalid column definitions: no AMOUNT columns defined');
        }

        amountColumns.forEach((cd) => {
            if (cd.walletId === undefined) {
                throw new Error(`Invalid column definitions: column '${cd.name}' is of type AMOUNT, but has no wallet ID defined.`);
            }
        })
    }

    private getColumnIndices(columnSemantic: ColumnSemantics): number[] {
        return this.columns.filter((cd) => cd.semantics == columnSemantic).map((cd) => this.columns.indexOf(cd));
    }

    private getColumnIndex(columnSemantic: ColumnSemantics): number | undefined {
        const indices = this.getColumnIndices(columnSemantic);
        if(indices.length > 1) {
            throw new Error(`Multiple columns with semantic ${columnSemantic}`);
        }
        return indices ? indices[0] : undefined;
    }

    private parseRecord(record: string[]): any[] {
        return record.map((valueStr: string, columnIndex: number) => {
            try {
                return this.parseCell(valueStr, this.columns[columnIndex]);
            } catch(error) {
                const errorMessage = (error instanceof Error) ? error.message : String(error);
                throw new Error(`Failed to parse value in column #${columnIndex}: ${errorMessage}`);
            }
        });
    }

    private parseCell(valueStr: string, columnDefinition: ColumnDefinition): any {
        switch(columnDefinition.semantics)
        {
            case ColumnSemantics.TIME: 
                const time = moment(valueStr, moment.ISO_8601);
                if(!time.isValid()) {
                    throw new Error(`Failed to parse time`);
                }
                return time;
            case ColumnSemantics.AMOUNT:
                if(valueStr === '') {
                    return 0;
                }
                const amount = Number.parseFloat(valueStr);
                if(isNaN(amount)) {
                    throw new Error(`Failed to parse number`);
                }
                // TODO truncate floats?
                return amount;
            case ColumnSemantics.CATEGORY:
                return valueStr; // category ID will be infered later
            case ColumnSemantics.NOTES:
                return valueStr;
            case ColumnSemantics.IGNORE:
                return valueStr;
            default:
                throw new Error(`Unknown column semantics`);
        };
    }

    private parseTransactionFromRecord(record: any[]): Transaction {
        let transaction: Partial<Transaction> = {};

        // Process TIME column
        transaction.time = record[this.timeColumnIndex];

        // Process CATEGORY column
        const categoryName = record[this.categoryColumnIndex];
        const category = this.categoriesByName.get(categoryName);
        if (category === undefined) {
            throw new Error(`Category '${categoryName}' (in column #${this.categoryColumnIndex}) does not exist.`);
        }
        transaction.categoryId = category.id;

        // Process NOTES column
        if (this.notesColumnIndex !== undefined) {
            transaction.notes = record[this.notesColumnIndex];
        }

        // Process AMOUNT column(s)
        const usedWalletColumnIndices = this.amountColumnIndices.filter((idx) => record[idx] !== 0);
        if (usedWalletColumnIndices.length < 1) {
            throw new Error(`Transaction is not associated with any wallets.`);
        }
        if (usedWalletColumnIndices.length > 2) {
            throw new Error(`Transaction is associated with mote than two wallets, which is not supported.`);
        }

        const amountSum = usedWalletColumnIndices.reduce((sum: number, columnIndex: number) => (sum + record[columnIndex]), 0);
        if (usedWalletColumnIndices.length > 1 && amountSum !== 0) {
            throw new Error(`Transaction amounts in source + destination wallets must add up to 0, instead it sums to ${amountSum}.`);
        }

        for(const columnIndex of usedWalletColumnIndices) {
            const amount = record[columnIndex];
            const coldef = this.columns[columnIndex];
            transaction.amount = Math.abs(amount);
            if (amount < 0 ) {
                transaction.sourceWalletId = coldef.walletId!;
            } else {
                transaction.destinationWalletId = coldef.walletId!;
            }
        }

        return transaction as Transaction;
    }

    private static parseNumberColumn(record: string[], columnIndex: number): number {
        const amountStr = record[columnIndex];
        const amount = Number.parseFloat(amountStr);
        if (isNaN(amount)) {
            throw new Error(`Could not parse number in column #${columnIndex}`);
        }
        return amount;
    }

}