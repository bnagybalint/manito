import { removeTimeZoneOffset } from "./dateUtils";


export function dateToISOString(date: Date): string {
    /**
     * Returns the date as an ISO 8601 string.
     * 
     * @param date The input date
     * @returns The date, ISO 8601 formatted.
     */
    return date.toISOString();
}

export function dateToISODateString(date: Date): string {
    /**
     * Returns the date part of the Date object to an ISO 8601 string.
     * 
     * @param date The input date
     * @returns The date part of the input, ISO 8601 formatted.
     */
    return removeTimeZoneOffset(date).toISOString().substring(0, 10);
}

export function dateFromISOString(dateStr: string): Date {
    /**
     * Returns the date stored in an ISO 8601 string.
     * 
     * @param date The ISO 8601 date string
     * @returns The date.
     */
    return new Date(dateStr);
}