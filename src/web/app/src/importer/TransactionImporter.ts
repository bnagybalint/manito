import moment from 'moment';
import { groupBy } from '@manito/common';
import { parseCsv, Options as CsvOptions } from 'util/CsvReader';

import Transaction from 'entity/Transaction';
import Category from 'entity/Category';

export enum ColumnSemantics {
    TIME = 'TIME',
    WALLET = 'WALLET',
    CATEGORY = 'CATEGORY',
    NOTES = 'NOTES',
    IGNORE = 'IGNORE',
}

export interface ColumnDefinition {
    // Name of the column
    name: string;
    // Semantics of the column, what is stored in it
    semantics: ColumnSemantics,
    // In case of WALLET column, the ID of the associated wallet
    walletId?: number;
}

export interface Options {
    delimiter?: string;
    hasHeader?: boolean;
    verifyColumnDefinitions?: boolean;
}

export class CsvTransactionImporter {
    columns: ColumnDefinition[];
    columnsByName: Map<string, ColumnDefinition>;
    categories: Category[];
    categoriesByName: Map<string, Category>;

    options: Options;

    timeColumnIndex: number;
    notesColumnIndex: number | undefined;
    categoryColumnIndex: number;
    amountColumnIndices: number[];

    public constructor(columns: ColumnDefinition[], categories: Category[], options?: Options) {
        this.columns = columns;
        this.columnsByName = new Map(columns.map((x) => [x.name, x]));
        this.categories = categories;
        this.categoriesByName = new Map(categories.map((x) => [x.name, x]));

        this.options = {
            delimiter: options?.delimiter ?? ';',
            hasHeader: options?.hasHeader ?? true,
            verifyColumnDefinitions: options?.verifyColumnDefinitions ?? true,
        };

        if (this.options.verifyColumnDefinitions) {
            this.verifyColumns();
        }

        this.timeColumnIndex = this.getColumnIndex(ColumnSemantics.TIME)!;
        this.notesColumnIndex = this.getColumnIndex(ColumnSemantics.NOTES);
        this.categoryColumnIndex = this.getColumnIndex(ColumnSemantics.CATEGORY)!;
        this.amountColumnIndices = this.getColumnIndices(ColumnSemantics.WALLET);
    }

    public loadRecords(csv: string): any[][] {

        const csvOptions: CsvOptions = {
            delimiter: this.options.delimiter,
            hasHeader: this.options.hasHeader,
            omitHeader: this.options.hasHeader,
            ltrim: true,
            rtrim: true,
        };

        const rawRecords = parseCsv(csv, csvOptions);

        return rawRecords.map((recordRaw: string[], recordIndex: number) => {
            try {
                if (recordRaw.length != this.columns.length) {
                    throw new Error(`Length of record (${recordRaw.length}) does not match that of column definitions (${this.columns.length}).`);
                }

                return this.parseRecord(recordRaw);

            } catch(error) {
                const errorMessage = (error instanceof Error) ? error.message : String(error);
                throw new Error(`Failed to parse record #${recordIndex + 1}: ${errorMessage}`);
            }
        });
    }

    public convertToTransactions(records: any[][]): Transaction[] {
        return records.map((record: any[], recordIndex: number) => {
            try {
                const transaction = this.parseTransactionFromRecord(record);
                return new Transaction(transaction);
                
            } catch(error) {
                const errorMessage = (error instanceof Error) ? error.message : String(error);
                throw new Error(`Failed to parse record #${recordIndex + 1}: ${errorMessage}`);
            }
        });
    }

    public loadFromString(csv: string): Transaction[] {
        const records = this.loadRecords(csv);
        const transactions = this.convertToTransactions(records);
        return transactions;
    }

    private verifyColumns() {
        if (this.getColumnIndices(ColumnSemantics.TIME).length != 1) {
            throw new Error('Invalid column definitions: no/multiple TIME columns defined');
        }
        if (this.getColumnIndices(ColumnSemantics.CATEGORY).length != 1) {
            throw new Error('Invalid column definitions: no/multiple CATEGORY columns defined');
        }

        const walletColumns = this.columns.filter((x) => x.semantics == ColumnSemantics.WALLET);
        if (walletColumns.length < 1) {
            throw new Error('Invalid column definitions: no WALLET columns defined');
        }

        groupBy(walletColumns, (cd) => cd.walletId).forEach((cds) => {
            if(cds.length > 1) {
                throw new Error(`Invalid column definitions: wallet column '${cds[0].name}' is defined multiple times`);
            }
        })

        walletColumns.forEach((cd) => {
            if (cd.walletId === undefined) {
                throw new Error(`Invalid column definitions: column '${cd.name}' is of type WALLET, but has no wallet ID defined.`);
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
            case ColumnSemantics.WALLET:
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

        // Process WALLET column(s)
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