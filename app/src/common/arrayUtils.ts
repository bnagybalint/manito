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
        r = (r != undefined) ? r : [];
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

