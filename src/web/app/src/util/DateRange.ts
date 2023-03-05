import moment from 'moment';

export default class DateRange {
    startDate: moment.Moment;
    endDate: moment.Moment;

    public constructor(startDate: moment.Moment, endDate: moment.Moment) {
        if(endDate.isBefore(startDate)) {
            throw new Error('End date must be after start date!');
        }

        this.startDate = startDate;
        this.endDate = endDate;
    }

    public isFullMonth(): boolean {
        return (
            (this.startDate.year() === this.endDate.year())
            && (this.startDate.month() === this.endDate.month())
            && (this.startDate.date() === moment(this.startDate).startOf('month').date())
            && (this.endDate.date() === moment(this.endDate).endOf('month').date())
        );
    }

    public isFullYear(): boolean {
        return (
            (this.startDate.year() === this.endDate.year())
            && (this.startDate.month() === 0 && this.startDate.date() === 1)
            && (this.endDate.month() === 11 && this.endDate.date() === 31)
        );
    }

    public addInterval(amount: number): DateRange {
        const diff = moment.duration(this.endDate.diff(this.startDate)).days() + 1;
        const days = amount * diff;
        
        return new DateRange(
            moment(this.startDate).add(days, 'days'),
            moment(this.endDate).add(days, 'days'),
        );
    }
}
