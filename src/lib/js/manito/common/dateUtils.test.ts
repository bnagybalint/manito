import { createDate } from "common/dateUtils";

describe('createDate', () => {
    test('fully specified', () => {
        expect(createDate(2020, 3, 4, 5, 6, 7, 0)).toEqual(new Date(Date.parse('2020-03-04T05:06:07.000')));
        expect(createDate(2020, 1, 1, 0, 0, 0, 0)).toEqual(new Date(Date.parse('2020-01-01T00:00:00.000')));
        expect(createDate(2020, 12, 31, 23, 59, 59, 999)).toEqual(new Date(Date.parse('2020-12-31T23:59:59.999')));
    });
    test('missing parameters are set to zero', () => {
        expect(createDate(2020, 3, 4)).toEqual(new Date(Date.parse('2020-03-04T00:00:00')));
        expect(createDate(2020, 3, 4, 12, 34)).toEqual(new Date(Date.parse('2020-03-04T12:34:00')));
        expect(createDate(2020, 3, 4, 12, 34, 56)).toEqual(new Date(Date.parse('2020-03-04T12:34:56')));
    });
});

describe('removeTimezoneOffset', () => {
    test('', () => {

        expect(createDate(2020, 3, 4, 5, 6, 7, 0)).toEqual(new Date(Date.parse('2020-03-04T05:06:07.000')));
        expect(createDate(2020, 1, 1, 0, 0, 0, 0)).toEqual(new Date(Date.parse('2020-01-01T00:00:00.000')));
        expect(createDate(2020, 12, 31, 23, 59, 59, 999)).toEqual(new Date(Date.parse('2020-12-31T23:59:59.999')));
    });
    test('missing parameters are set to zero', () => {
        expect(createDate(2020, 3, 4)).toEqual(new Date(Date.parse('2020-03-04T00:00:00')));
        expect(createDate(2020, 3, 4, 12, 34)).toEqual(new Date(Date.parse('2020-03-04T12:34:00')));
        expect(createDate(2020, 3, 4, 12, 34, 56)).toEqual(new Date(Date.parse('2020-03-04T12:34:56')));
    });
});