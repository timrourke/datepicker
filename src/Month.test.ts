import {start} from 'repl';
import Month from './Month';

describe('Month', () => {
   it('should create a month from today', () => {
       const actual = Month.fromToday();

       expect(actual).toBeDefined();
   });

   it('should get every week of June, 2019', () => {
       const startDate = new Date('Mon, Jun 01 2019');
       const month = new Month(startDate);
       const actual = month.weeks();

       expect(actual).toHaveLength(6);
       expect(actual[0].firstSundayOfWeek().toDateString())
           .toEqual('Sun May 26 2019');
       expect(actual[1].firstSundayOfWeek().toDateString())
           .toEqual('Sun Jun 02 2019');
       expect(actual[2].firstSundayOfWeek().toDateString())
           .toEqual('Sun Jun 09 2019');
       expect(actual[3].firstSundayOfWeek().toDateString())
           .toEqual('Sun Jun 16 2019');
       expect(actual[4].firstSundayOfWeek().toDateString())
           .toEqual('Sun Jun 23 2019');
       expect(actual[5].firstSundayOfWeek().toDateString())
           .toEqual('Sun Jun 30 2019');
   });

   it('should expose month', () => {
       const startDate = new Date('Mon Jun 01 2019');
       const month = new Month(startDate);
       const actual = month.month();

       expect(actual).toBe(5);
   });

   it('should expose month name', () => {
       const startDate = new Date('Thu Jan 24 2019');
       const month = new Month(startDate);
       const actual = month.name();

       expect(actual).toBe('Jan');
   });

   it('should get next month', () => {
       const startDate = new Date('Mon Jun 01 2019');
       const month = new Month(startDate);
       const actual = month.nextMonth();

       expect(actual.month()).toEqual(startDate.getMonth() + 1);
   });

   it('should get previous month', () => {
        const startDate = new Date('Mon Jun 01 2019');
        const month = new Month(startDate);
        const actual = month.previousMonth();

        expect(actual.month()).toEqual(startDate.getMonth() - 1);
    });

   it('should get year', () => {
        const startDate = new Date('Tue Jan 01 2019 12:00 AM');
        const month = new Month(startDate);
        const actual = month.year();

        expect(actual).toEqual(2019);
   });
});
