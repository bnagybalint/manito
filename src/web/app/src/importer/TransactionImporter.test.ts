import moment from 'moment';

import Category from 'entity/Category';
import Transaction from 'entity/Transaction';

import { ColumnDefinition, ColumnSemantics, CsvTransactionImporter } from './TransactionImporter';


const CATEGORIES = [
    new Category({ id: 2001, ownerId: 0, name: 'Groceries', iconId: 0, iconColor: '' }),
    new Category({ id: 2002, ownerId: 0, name: 'Fun', iconId: 0, iconColor: '' }),
    new Category({ id: 2003, ownerId: 0, name: 'Regular Income', iconId: 0, iconColor: '' }),
    new Category({ id: 2004, ownerId: 0, name: 'Transfer', iconId: 0, iconColor: '' }),
];

const parse = (data: string): Transaction[] => {
    const columns: Array<ColumnDefinition> = [
        { name: 'time', semantics: ColumnSemantics.TIME },
        { name: 'category', semantics: ColumnSemantics.CATEGORY },
        { name: 'amount1', semantics: ColumnSemantics.AMOUNT, walletId: 1001 },
        { name: 'amount2', semantics: ColumnSemantics.AMOUNT, walletId: 1002 },
        { name: 'amount3', semantics: ColumnSemantics.AMOUNT, walletId: 1003 },
    ];

    const importer = new CsvTransactionImporter(columns, CATEGORIES);
    const transactions = importer.loadFromString(data, { hasHeader: false });

    return transactions;
}

describe('CsvTransactionImporter', () => {

    test('column definitions are verified', () => {
        const time: ColumnDefinition = { name: 'a', semantics: ColumnSemantics.TIME };
        const cat: ColumnDefinition = { name: 'b', semantics: ColumnSemantics.CATEGORY };
        const notes: ColumnDefinition = { name: 'c', semantics: ColumnSemantics.NOTES };
        const amount: ColumnDefinition = { name: 'w1', semantics: ColumnSemantics.AMOUNT, walletId: 1001 };
        const amount2: ColumnDefinition = { name: 'w2', semantics: ColumnSemantics.AMOUNT, walletId: 1002 };
        const amount3: ColumnDefinition = { name: 'w2', semantics: ColumnSemantics.AMOUNT, walletId: 1003 };
        const amount_no_wallet: ColumnDefinition = { name: 'w3', semantics: ColumnSemantics.AMOUNT };
        const ignore: ColumnDefinition = { name: 'f', semantics: ColumnSemantics.IGNORE };
        const ignore2: ColumnDefinition = { name: 'g', semantics: ColumnSemantics.IGNORE };
        const ignore3: ColumnDefinition = { name: 'h', semantics: ColumnSemantics.IGNORE };

        expect(() => new CsvTransactionImporter([time,cat,amount], [])).not.toThrow(); // minimal config
        expect(() => new CsvTransactionImporter([cat,amount,time], [])).not.toThrow(); // order does not matter
        expect(() => new CsvTransactionImporter([time,cat,amount,notes], [])).not.toThrow(); // with optional notes

        expect(() => new CsvTransactionImporter([time,cat,amount,amount2], [])).not.toThrow(); // multiple wallet columns are accepted
        expect(() => new CsvTransactionImporter([time,cat,amount,amount2,amount3], [])).not.toThrow(); // multiple wallet columns are accepted

        // IGNORE columns are allowed anywhere
        expect(() => new CsvTransactionImporter([ignore,cat,amount,time], [])).not.toThrow();
        expect(() => new CsvTransactionImporter([cat,amount,ignore,time], [])).not.toThrow();
        expect(() => new CsvTransactionImporter([cat,amount,time,ignore], [])).not.toThrow();
        expect(() => new CsvTransactionImporter([cat,ignore,amount,ignore2,ignore3,time], [])).not.toThrow();

        // throws on incomplete configs
        expect(() => new CsvTransactionImporter([], [])).toThrow();
        expect(() => new CsvTransactionImporter([time], [])).toThrow();
        expect(() => new CsvTransactionImporter([time,cat], [])).toThrow();
        expect(() => new CsvTransactionImporter([cat,amount], [])).toThrow();

        // throws on invalid column definition
        expect(() => new CsvTransactionImporter([time,cat,amount_no_wallet], [])).toThrow();
    });

    test('empty document', () => {
        const data = ``;

        const columns: Array<ColumnDefinition> = [
            { name: 'time', semantics: ColumnSemantics.TIME },
            { name: 'category', semantics: ColumnSemantics.CATEGORY },
            { name: 'amount', semantics: ColumnSemantics.AMOUNT, walletId: 123 },
        ];

        const importer = new CsvTransactionImporter(columns, CATEGORIES);
        const transactions = importer.loadFromString(data, { hasHeader: false });

        expect(transactions).toEqual([]);
    });

    test('header-only document', () => {
        const data = `
            a;bbbb;c;dd
        `;

        const columns: Array<ColumnDefinition> = [
            { name: 'a', semantics: ColumnSemantics.TIME },
            { name: 'bbbb', semantics: ColumnSemantics.CATEGORY },
            { name: 'c', semantics: ColumnSemantics.NOTES },
            { name: 'dd', semantics: ColumnSemantics.AMOUNT, walletId: 123 },
        ];

        const importer = new CsvTransactionImporter(columns, CATEGORIES);
        
        const transactions = importer.loadFromString(data, { hasHeader: true });
        expect(transactions).toEqual([]);
    });

    test('single expense', () => {
        expect(
            parse('2023-03-11;Groceries;-12345;;')
        ).toEqual([
            new Transaction({time: moment('2023-03-11'), categoryId: 2001, amount: 12345, sourceWalletId: 1001}),
        ])
    });

    test('single income', () => {
        expect(
            parse('2023-03-13;Regular Income;450000;;')
        ).toEqual([
            new Transaction({time: moment('2023-03-13'), categoryId: 2003, amount: 450000, destinationWalletId: 1001}),
        ])
    });

    test('transfer transaction', () => {
        expect(
            parse('2023-03-13;Regular Income;1234;-1234;')
        ).toEqual([
            new Transaction({time: moment('2023-03-13'), categoryId: 2003, amount: 1234, destinationWalletId: 1001, sourceWalletId: 1002}),
        ])
    });

    test('three-wallet mixed', () => {
        const data = `
            2023-03-11;Groceries;-12345;;
            2023-03-12;Fun;;-6700;
            2023-03-12;Fun;;;5000
            2023-03-13;Regular Income;450000;;
            2023-03-23;Regular Income;;10000;-10000
        `;

        expect(parse(data)).toEqual([
            new Transaction({time: moment('2023-03-11'), categoryId: 2001, amount: 12345, sourceWalletId: 1001}),
            new Transaction({time: moment('2023-03-12'), categoryId: 2002, amount: 6700, sourceWalletId: 1002}),
            new Transaction({time: moment('2023-03-12'), categoryId: 2002, amount: 5000, destinationWalletId: 1003}),
            new Transaction({time: moment('2023-03-13'), categoryId: 2003, amount: 450000, destinationWalletId: 1001}),
            new Transaction({time: moment('2023-03-23'), categoryId: 2003, amount: 10000, sourceWalletId: 1003, destinationWalletId: 1002}),
        ])
    });

    test('test invalids', () => {
        expect(() => parse('asdf;Fun;450000;;')).toThrow(); // invalid time format
        expect(() => parse('2023-01-23;asdf;450000;;')).toThrow(); // missing category
        expect(() => parse('2023-01-23;Fun;asdf;;')).toThrow(); // invalid amount number format
        expect(() => parse('2023-01-23;Fun;;;')).toThrow(); // at least one wallet must be associated with transaction
        expect(() => parse('2023-01-23;Fun;100;-200;100')).toThrow(); // at most two wallets can be associated with transaction
        expect(() => parse('2023-01-23;Fun;0;;')).toThrow(); // missing amount value (cannot be zero)
        expect(() => parse('2023-01-23;Fun;100;-200;')).toThrow(); // amounts must add up to 0
    });

});