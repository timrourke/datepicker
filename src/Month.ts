import Week from './Week';

export default class Month {
    public static fromToday(): Month {
        return new Month(new Date());
    }

    private readonly monthNames: string[] = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
    ];

    private readonly fromDate: Date;

    constructor(fromDate: Date) {
        this.fromDate = fromDate;
    }

    public weeks(): Week[] {
        const firstDayOfMonth = this.firstDayOfMonth();
        const firstWeek = new Week(firstDayOfMonth);

        const weeks: Week[] = [firstWeek];
        let nextWeek = firstWeek.nextWeek();

        while (nextWeek.firstSundayOfWeek().getMonth() === firstDayOfMonth.getMonth()) {
            weeks.push(nextWeek);
            nextWeek = nextWeek.nextWeek();
        }

        return weeks;
    }

    public nextMonth(): Month {
        const firstDayOfNextMonth = new Date(this.firstDayOfMonth());

        firstDayOfNextMonth.setMonth(this.fromDate.getMonth() + 1);

        return new Month(firstDayOfNextMonth);
    }

    public previousMonth(): Month {
        const firstDayOfPreviousMonth = new Date(this.firstDayOfMonth());

        firstDayOfPreviousMonth.setMonth(this.fromDate.getMonth() - 1);

        return new Month(firstDayOfPreviousMonth);
    }

    public name(): string {
        return this.monthNames[this.firstDayOfMonth().getMonth()];
    }

    public month(): number {
        return this.firstDayOfMonth().getMonth();
    }

    public year(): number {
        return this.firstDayOfMonth().getFullYear();
    }

    private firstDayOfMonth(): Date {
        const firstDayOfMonth = new Date(this.fromDate);

        firstDayOfMonth.setDate(1);

        return firstDayOfMonth;
    }
}
