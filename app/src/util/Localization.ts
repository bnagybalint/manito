import dateFormat from 'dateformat';
import moment from 'moment';

export default class Localization {
    static formatDateTime(date: Date) {
        return dateFormat(date, 'yyyy-mm-dd, HH:MM:ss')
    }

    static formatDate(date: Date) {
        return dateFormat(date, 'yyyy-mm-dd')
    }

    static formatDateLocale(date: moment.Moment): string {
        const localeData = moment.localeData();
        return date.format(localeData.longDateFormat('LL'));
    }

    static formatMoneyAmount(amount: number) {
        const s = Math.abs(amount).toLocaleString(undefined, {minimumFractionDigits: 2});
        if(amount < 0) {
            return `- ${s}`;
        }
        if (amount > 0) {
            return `+ ${s}`;
        }
    
        return `${s}`;
    }
}