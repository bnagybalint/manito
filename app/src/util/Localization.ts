import dateFormat from 'dateformat';

export default class Localization {
    static formatDateTime(date: Date) {
        return dateFormat(date, 'yyyy-mm-dd, HH:MM:ss')
    }

    static formatDate(date: Date) {
        return dateFormat(date, 'yyyy-mm-dd')
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