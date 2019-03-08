import * as moment from 'moment';

export class TimeUtils {
    // convert time from HH:mm:ss to HH:mm
    public static formatTime(time: string): string {
        const splitTime = time.split(':');
        if (splitTime.length >= 2) {
            return `${splitTime[0]}:${splitTime[1]}`;
        }

        return '';
    }

    public static getDurationInMinutes(from: string, to: string): number {
        // format HH:mm:ss
        const fromDate = moment('1970-01-01T' + from);
        const toDate = moment('1970-01-01T' + to);

        const duration = moment.duration(toDate.diff(fromDate));

        return duration.asMinutes();
    }

    public static getStartOfTheMonthDate(date: Date): string {
        date.setDate(1);

        return TimeUtils.getDateShort(date);
    }

    public static getDateShort(date: Date): string {
        return moment(date).format('YYYY-MM-DD');
    }

    public static formatDateAndTime(date: Date): string {
        return moment(date).format('YYYY-MM-DD[T]HH:mm:ss');
    }

    public static formatDateUTC(date: Date): string {
        if (!date) {
            return '';
        }

        return moment(date).utc().format();

    }

    public static getMilliseconds(time: string): number {
        if (!time) {
            return NaN;
        }

        return moment('2000-01-01T' + time).valueOf();
    }

    public static getStartOfTheDay(date: Date): Date {
        if (!date) {
            return new Date('');
        }

        return moment(date).startOf('day').toDate();
    }

    public static getEndOfTheDay(date: Date): Date {
        if (!date) {
            return new Date('');
        }

        return moment(date).endOf('day').toDate();
    }

    public static formatDate(date: Date): string {
        return moment(date).format();
    }

    public static getTimeFromDate(date: Date): string {
        return moment(date).format('HH:mm');
    }
}
