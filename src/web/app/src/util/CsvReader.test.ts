import { parseCsv } from "./CsvReader"


describe('parseCsv', () => {

    test('empty document', () => {
        expect(parseCsv('')).toEqual([]);
    });

    test('header-only document', () => {
        expect(parseCsv('a;b;c')).toEqual([['a', 'b', 'c']]);
    });

    test('header-less document', () => {
        expect(parseCsv('1;2;foo', {hasHeader: false})).toEqual([['1', '2', 'foo']]);
    });

    test('single column document', () => {
        const data = `
            a
            1
            4
        `;

        expect(parseCsv(data, {hasHeader: true})).toEqual([
            ['a'],
            ['1'],
            ['4'],
        ]);
    });

    test('multi-column document', () => {
        const data = `
            a;b;c
            1;2;foo
            4;5;bar
        `;

        expect(parseCsv(data, {hasHeader: true})).toEqual([
            ['a', 'b', 'c'],
            ['1', '2', 'foo'],
            ['4', '5', 'bar'],
        ]);
    });

    test('option: delimiter', () => {
        const data = `
            a,b,c
            1,2,foo
            4,5,bar
        `;

        expect(parseCsv(data, {hasHeader: true, delimiter: ','})).toEqual([
            ['a', 'b', 'c'],
            ['1', '2', 'foo'],
            ['4', '5', 'bar'],
        ]);
    });

    test('option: record delimiter', () => {
        const data = `a;b;c#1;2;foo#4;5;bar
        `;

        expect(parseCsv(data, {hasHeader: true, recordDelimiter: '#'})).toEqual([
            ['a', 'b', 'c'],
            ['1', '2', 'foo'],
            ['4', '5', 'bar'],
        ]);
    });

    test('option: omit header', () => {
        const data = `
            a;b;c
            1;2;3
        `;

        expect(parseCsv(data)).toEqual([['a', 'b', 'c'],['1', '2', '3']]);
        expect(parseCsv(data, { omitHeader: true })).toEqual([['1', '2', '3']]);
    });

});