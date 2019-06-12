import Week from './Week';

export default class Month {

    public static fromToday(): Month {
        return new Month(new Date());
    }
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

    private firstDayOfMonth(): Date {
        const firstDayOfMonth = new Date(this.fromDate);

        firstDayOfMonth.setDate(1);

        return firstDayOfMonth;
    }
}
