import Week from './Week';

describe('Week', () => {
    it('should build week', () => {
        const firstDay = new Date('Wed Jun 12 2019');

        const week = new Week(firstDay);

        const actual = week.build();

        expect(actual.map((day) => day.toDateString()))
            .toEqual([
                'Sun Jun 09 2019',
                'Mon Jun 10 2019',
                'Tue Jun 11 2019',
                'Wed Jun 12 2019',
                'Thu Jun 13 2019',
                'Fri Jun 14 2019',
                'Sat Jun 15 2019',
            ]);
    });

    it('should get the first Sunday of the week of June 1, 2019', () => {
        const startDate = new Date('Mon Jun 01 2019');
        const week = new Week(startDate);
        const firstSunday = week.firstSundayOfWeek();

        expect(firstSunday.toDateString())
            .toEqual('Sun May 26 2019');
    });

    it('should get the next week from June 1, 2019', () => {
        const startDate = new Date('Mon Jun 01 2019');
        const thisWeek = new Week(startDate);
        const nextWeek = thisWeek.nextWeek();

        expect(nextWeek.firstSundayOfWeek().toDateString())
            .toEqual('Sun Jun 02 2019');
    });
});
