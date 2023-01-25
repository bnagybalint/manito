import { groupBy, ungroup, comparePrimitive } from "./arrayUtils";

const isOdd = (x: number) => x % 2;
const wordLength = (x: string) => x.length;

describe('groupBy', () => {
    test('works with empty lists', () => {
        expect(groupBy([], isOdd)).toEqual(new Map());
        expect(groupBy([], wordLength)).toEqual(new Map());
    });
    test('works with integers', () => {
        expect(groupBy([2,5], isOdd)).toEqual(new Map([
            [0, [2]],
            [1, [5]],
        ]));
    });
    test('keeps item order', () => {
        expect(groupBy([2,5,6,4,3], isOdd)).toEqual(new Map([
            [0, [2,6,4]],
            [1, [5,3]],
        ]));
    });
    test('keeps equal items', () => {
        expect(groupBy([2,2,2], isOdd)).toEqual(new Map([[0, [2,2,2]]]));
    });
    test('works with string', () => {
        expect(
            groupBy(['alma', 'korte', 'szilva', 'banan'], wordLength)
        ).toEqual(new Map([
            [4, ['alma']],
            [5, ['korte', 'banan']],
            [6, ['szilva']],
        ]));
    });
});


describe('groupBy', () => {
    test('works with empty map', () => {
        expect(ungroup(new Map())).toEqual([]);
    });
    test('works with string', () => {
        expect(ungroup(
            new Map([
                [4, ['alma']],
                [5, ['korte', 'banan']],
                [6, ['szilva']],
            ])
        ).sort()).toEqual(
            ['alma', 'korte', 'szilva', 'banan'].sort()
        );
    });
    test('sublist ordering is preserved', () => {
        const r = ungroup(new Map([
            ['a', [0,1,2,3]],
            ['d', [4]],
            ['b', [5,6]],
            ['c', [7,8,9]],
        ]))
        expect(r.join('').includes('0123')).toBe(true);
        expect(r.join('').includes('4')).toBe(true);
        expect(r.join('').includes('56')).toBe(true);
        expect(r.join('').includes('789')).toBe(true);
    });
});


describe('comparePrimitive', () => {
    test('works with numbers', () => {
        expect(comparePrimitive(1, 3)).toBeLessThan(0);
        expect(comparePrimitive(3, 3)).toBe(0);
        expect(comparePrimitive(6, 3)).toBeGreaterThan(0);

        expect(comparePrimitive(-1, -3)).toBeGreaterThan(0);
        expect(comparePrimitive(-3, -3)).toBe(0);
        expect(comparePrimitive(-6, -3)).toBeLessThan(0);

        expect(comparePrimitive(0.1, 100)).toBeLessThan(0);
        expect(comparePrimitive(0.1, 0.1)).toBe(0);
        expect(comparePrimitive(100, 0.1)).toBeGreaterThan(0);

        expect(comparePrimitive(1e3, 1e4)).toBeLessThan(0);
        expect(comparePrimitive(1e-3, 1e-4)).toBeGreaterThan(0);
    });
    test('works with strings', () => {
        expect(comparePrimitive("", "")).toBe(0);
        expect(comparePrimitive("", "aaa")).toBeLessThan(0);
        expect(comparePrimitive("aaa", "")).toBeGreaterThan(0);

        expect(comparePrimitive("aaaa", "aaaa")).toBe(0);
        expect(comparePrimitive("aabb", "abc")).toBeLessThan(0);
        expect(comparePrimitive("abc", "abcd")).toBeLessThan(0);
        expect(comparePrimitive("a", "abcd")).toBeLessThan(0);
    });
});

