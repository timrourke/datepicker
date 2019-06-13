export default class Week {
    private readonly firstDay: Date;

    constructor(firstDay: Date) {
        this.firstDay = firstDay;
    }

    public build(): Date[] {
        const firstSundayOfWeek = this.firstSundayOfWeek();

        return [0, 1, 2, 3, 4, 5, 6]
            .map((daysToAdd: number): Date => {
                const dayOfWeek = new Date(firstSundayOfWeek);

                dayOfWeek.setDate(
                    firstSundayOfWeek.getDate() + daysToAdd,
                );

                return dayOfWeek;
            });
    }

    public nextWeek(): Week {
        const firstSundayOfNextWeek = new Date(this.firstSundayOfWeek());

        firstSundayOfNextWeek.setDate(
            firstSundayOfNextWeek.getDate() + 7,
        );

        return new Week(firstSundayOfNextWeek);
    }

    public firstSundayOfWeek(): Date {
        const firstSundayOfWeek = new Date(this.firstDay);

        firstSundayOfWeek.setDate(
            this.firstDay.getDate() - this.firstDay.getDay(),
        );

        return firstSundayOfWeek;
    }
}
