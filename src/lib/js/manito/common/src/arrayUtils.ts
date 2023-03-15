export function groupBy<K, T>(arr: T[], keyFn: (item: T) => K): Map<K,T[]> {
    /**
     * Groups array elements using a grouping callback.
     * 
     * @param arr The array to be grouped
     * @param keyFn The grouping logic.
     * @returns The array items grouped into a Map object.
     */
    return arr.reduce((m: Map<K,T[]>, item: T) => {
        const k = keyFn(item);
        let r = m.get(k);
        r = (r !== undefined) ? r : [];
        r.push(item);
        m.set(k, r);
        return m;
    }, new Map<K,T[]>());
}

export function ungroup<K, T>(m: Map<K,T[]>): T[] {
    /**
     * Ungroups a map, flattening the items of the groups into a single array.
     * NOTE: due to the implementation-defined ordering of maps, there are no guarantees
     * on the order of the concatenation of the sub-lists. However, sub-list ordering is
     * preserved.
     * 
     * @param m The map to be grouped
     * @returns The array items grouped into a Map object.
     */
    return Array.from(m.values()).flat();
}

export function comparePrimitive<T>(a: T, b: T): number {
    /**
     * Space-ship comparison for primitive types.
     * 
     * @param a One primitive
     * @param b Other primitive
     * @returns
     *  - negative, if a < b
     *  - zero, if a == b
     *  - positive, if a > b
     */
    if(typeof a === "number" && typeof b === "number") {
        return a - b;
    }

    if(typeof a === "string" && typeof b === "string") {
        return a.localeCompare(b);
    }

    if(typeof a === "boolean" && typeof b === "boolean") {
        return (+a) - (+b);
    }

    if(typeof a !== typeof b) {
        throw new Error(`Could not compare objects of different type (${typeof a}) and ${typeof b}`);
    }

    throw new Error(`Unknown type, failed to compare: ${typeof a}`);
}

export function sortBy<K, T>(arr: T[], keyFn: (item: T) => K, compareFn: (a: K, b: K) => number = comparePrimitive): T[] {
    /**
     * Sorts array elements using a key callback. 
     * 
     * @param arr The array to be sorted
     * @param keyFn The key logic.
     * @param compareFn The compare logic. By default, it's `comparePrimitive`, which performs
     * a natural ascending ordering for primitive types.
     * @returns The array sorted in the increasing order of keys.
     */
    return arr.sort((a: T, b: T): number => {
        const ka = keyFn(a);
        const kb = keyFn(b);
        return compareFn(ka, kb)
    });
}

export function zip<T1, T2>(arr1: T1[], arr2: T2[]): Array<Array<T1 | T2>> {
    /**
     * Zips arrays, i.e. builds pairs from items at corresponding indices in the input arrays. Pairs are returned as arrays.
     * 
     * Example:
     * ```
     *    zip([1, 2],["a", "b"]) == [[1, "a"], [2, "b"]]
     * ```
     * 
     * @param arr1 The array
     * @param arr2 The other array
     * @returns The zipped array
     */
    return arr1.slice(0, Math.min(arr1.length, arr2.length)).map((val, i) => [val, arr2[i]]);
}