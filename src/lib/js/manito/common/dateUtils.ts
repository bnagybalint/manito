export function createDate(
    year: number,
    month: number,
    day: number,
    hour?: number,
    minute?: number,
    second?: number,
    millisecond?: number,
): Date {
    /**
     * Helper function to create date objects the intuitive way (months are measured from 1)
     */
    return new Date(
        year,
        month - 1,
        day,
        hour ?? 0,
        minute ?? 0,
        second ?? 0,
        millisecond ?? 0,
    );
}

export function removeTimeZoneOffset(dt: Date): Date {
    /**
     * Removes the the timezone offset from a Date, to get a Date object with the same clock value
     * but in GMT+0.
     * 
     * Example:
     *  - 2022-09-31T00:00:00+02:00 (midnight in GMT+2)
     * becomes:
     *  - 2022-09-31T00:00:00+00:00 (midnight in GMT+0).
     * 
     * WARNING: As Date object does not store time zone data, this operation CHANGES the effective time value.
     *          Use with care!
     * 
     * Motivation:
     *  let dt = new Date(2022,0,1); // 2022-01-01T00:00:00+XXXX
     *  dt = removeTimeZoneOffset(dt);
     *  dt.toISOString() // now always returns 2022-01-01
     * 
     * @param dt The date to remove the ofset from
     * @returns The date with the same clock value, but in GMT+0
     */

    // NOTE: Timezone offset is subtracted (instead of added), because offset is measured in minutes,
    //       from local time to GMT+0.
    return new Date(dt.valueOf() - dt.getTimezoneOffset() * 60 * 1000);
}
