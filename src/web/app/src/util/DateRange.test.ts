import moment from 'moment';

import DateRange from './DateRange';

describe('DateRange', () => {
    test('constructor throws if invalid range', () => {
        expect(() => { new DateRange(moment("2020-02-02"), moment("2020-02-03")) }).not.toThrow();
        expect(() => { new DateRange(moment("2020-02-02"), moment("2020-02-02")) }).not.toThrow();
        expect(() => { new DateRange(moment("2020-02-02"), moment("2020-02-01")) }).toThrow();
    });

    test('is* methods do not change the object', () => {
        const x = moment('2022-02-02');
        const unchanged = x.clone();
        const range = new DateRange(x, x);

        range.isFullMonth();
        expect(range.startDate).toEqual(unchanged);
        expect(range.endDate).toEqual(unchanged);

        range.isFullYear();
        expect(range.startDate).toEqual(unchanged);
        expect(range.endDate).toEqual(unchanged);
    });

    test('isFullMonth reports if the range is precicely a single month', () => {
        expect(new DateRange(moment("2021-01-01"), moment("2021-01-31")).isFullMonth()).toBe(true); // January
        expect(new DateRange(moment("2021-12-01"), moment("2021-12-31")).isFullMonth()).toBe(true); // December
        expect(new DateRange(moment("2021-02-01"), moment("2021-02-28")).isFullMonth()).toBe(true); // February in normal years

        expect(new DateRange(moment("2021-05-01"), moment("2021-06-31")).isFullMonth()).toBe(false); // month start+end different months
        expect(new DateRange(moment("2021-05-01"), moment("2022-05-31")).isFullMonth()).toBe(false); // month start+end in the same month, different years
        expect(new DateRange(moment("2021-03-11"), moment("2021-03-13")).isFullMonth()).toBe(false); // interval within month
        expect(new DateRange(moment("2021-05-04"), moment("2021-06-22")).isFullMonth()).toBe(false); // interval overlapping month boundary
        expect(new DateRange(moment("2021-05-04"), moment("2022-01-18")).isFullMonth()).toBe(false); // interval overlapping year boundary
        expect(new DateRange(moment("2021-03-01"), moment("2021-03-13")).isFullMonth()).toBe(false); // interval containing month start
        expect(new DateRange(moment("2021-03-13"), moment("2021-03-31")).isFullMonth()).toBe(false); // interval containing month end
        expect(new DateRange(moment("2020-02-01"), moment("2020-02-28")).isFullMonth()).toBe(false); // February is longer in leap years
    });

    test('isFullYear reports if the range is precicely a single year', () => {
        expect(new DateRange(moment("2021-01-01"), moment("2021-12-31")).isFullYear()).toBe(true);
        expect(new DateRange(moment("2020-01-01"), moment("2020-12-31")).isFullYear()).toBe(true); // leap year

        expect(new DateRange(moment("2021-05-01"), moment("2021-06-31")).isFullYear()).toBe(false); // month start+end different months
        expect(new DateRange(moment("2021-05-01"), moment("2022-05-31")).isFullYear()).toBe(false); // month start+end in the same month, different years
        expect(new DateRange(moment("2021-03-11"), moment("2021-03-13")).isFullYear()).toBe(false); // interval within month
        expect(new DateRange(moment("2021-05-04"), moment("2021-06-22")).isFullYear()).toBe(false); // interval overlapping month boundary
        expect(new DateRange(moment("2021-05-04"), moment("2022-01-18")).isFullYear()).toBe(false); // interval overlapping year boundary
        expect(new DateRange(moment("2021-03-01"), moment("2021-03-13")).isFullYear()).toBe(false); // interval containing month start
        expect(new DateRange(moment("2021-03-13"), moment("2021-03-31")).isFullYear()).toBe(false); // interval containing month end
    });

    test.each([
        ["2021-05-10", "2021-05-10",  1, "2021-05-11", "2021-05-11"], // +1 (1-day)
        ["2021-05-10", "2021-05-10", -1, "2021-05-09", "2021-05-09"], // -1 (1-day)
        ["2021-05-10", "2021-05-16",  1, "2021-05-17", "2021-05-23"], // +1 (week)
        ["2021-05-10", "2021-05-16", -1, "2021-05-03", "2021-05-09"], // -1 (week)
        ["2021-05-10", "2021-06-09",  1, "2021-06-10", "2021-07-10"], // +1 (31 days)
        ["2021-05-10", "2021-06-09", -1, "2021-04-09", "2021-05-09"], // -1 (31 days)
    ])('addInterval([%p - %p], %p)', (inStart: string, inEnd: string, numIntervals: number, expStart: string, expEnd: string, ) => {
        const input = new DateRange(moment(inStart), moment(inEnd));
        const expected = new DateRange(moment(expStart), moment(expEnd));
        const result = input.addInterval(numIntervals);
        expect(result.startDate.isSame(expected.startDate)).toBe(true);
        expect(result.endDate.isSame(expected.endDate)).toBe(true);
    });
});
