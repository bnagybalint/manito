export function groupBy<K, T>(arr: T[], keyFn: (item: T) => K): Map<K,T[]> {
    /**
     * Groups array elements using a grouping callback.
     * 
     * @param arr The array to be grouped
     * @returns The array items grouped into a Map object.
     */
    return arr.reduce((m: Map<K,T[]>, item: T) => {
        const k = keyFn(item);
        let r = m.get(k);
        r = (r != undefined) ? r : [];
        r.push(item);
        m.set(k, r);
        return m;
    }, new Map<K,T[]>());
}
