import Month from './Month';

function debounce(func: any, wait: number, immediate: boolean) {
    let theTimeOut: number;

    return function() {
        const context = this;
        const args = arguments;
        const later = () => {
            theTimeOut = null;
            if (!immediate) {
                func.apply(context, args);
            }
        };

        const callNow = immediate && !theTimeOut;
        clearTimeout(theTimeOut);
        theTimeOut = window.setTimeout(later, wait);

        if (callNow) {
            func.apply(context, args);
        }
    };
}

export default class DatePicker extends HTMLElement {
    private readonly css = `
:host *,
:host *::before,
:host *::after {
    box-sizing: border-box;
}

table {
    border-collapse: collapse;
}

.month-and-year {
    text-align: center;
}

.btn {
    width: 100%;
}

.day {
    height: 1.25em;
    min-width: 1.375em;
    position: relative;
}

.day:hover {
    background: lightblue;
}

.day.other-month {
    background-color: #eee;
}

.btn-day {
    -webkit-appearance: none;
    background: transparent;
    border: none;
    height: 100%;
    left: 0;
    margin: 0;
    outline: none;
    padding: 0.25em;
    position: absolute;
    text-align: right;
    text-transform: none;
    top: 0;
    width: 100%;
}

.btn-day:hover {
    color: blue;
    cursor: pointer;
}

.next {
    text-align: right;
}

.date-picker-wrapper {
    position: relative;
}

.calendar {
    background-color: white;
    box-shadow: 0 3px 10px rgba(0,0,0,0.125);
    left: 50%;
    margin-top: 1em;
    outline: 0.0675em solid #eee;
    padding: 0.125em;
    position: absolute;
    top: 100%;
    transform: translateX(-50%);
}

.today,
.today .btn-day {
    color: red;
}

.selected-day {
    background-color: lightblue;
}
    `;

    private debouncedHandleKeyupInputDate: () => void;
    private month: Month;
    private selectedDate: Date;
    private readonly root: ShadowRoot;

    constructor() {
        super();
        this.month = Month.fromToday();
        this.root = this.attachShadow({mode: 'open'});
        this.handleClickNextMonth = this.handleClickNextMonth.bind(this);
        this.handleClickPreviousMonth = this.handleClickPreviousMonth.bind(this);
        this.handleFocusInInputDate = this.handleFocusInInputDate.bind(this);
        this.handleClickBody = this.handleClickBody.bind(this);
        this.handleClickDay = this.handleClickDay.bind(this);
        this.handleKeyUpInputDate = this.handleKeyUpInputDate.bind(this);
        this.renderTemplate();
        this.renderCalendar(this.month);
    }

    public disconnectedCallback(): void {
        this.unbindEvents();
    }

    private template(style: string) {
        return `
<style>${style}</style>
<span class="date-picker-wrapper">
    <input class="input-date" type="text" placeholder="Date" />
    <table class="calendar" style="display: none;">
        <thead>
            <tr>
                <th class="previous" colspan="3">
                    <button class="btn btn-prev">Prev</button>
                </th>
                <th></th>
                <th class="next" colspan="3">
                    <button class="btn btn-next">Next</button>
                </th>
            </tr>
            <tr>
                <th class="month-and-year" colspan="7"></th>
            </tr>
            <tr>
                <th>S</th>
                <th>M</th>
                <th>T</th>
                <th>W</th>
                <th>T</th>
                <th>F</th>
                <th>S</th>
            </tr>
        </thead>
        <tbody>
        </tbody>
    </table>
</span>
`;
    }

    private renderTemplate(): void {
        this.root.innerHTML = this.template(this.css);

        this.bindEvents();
    }

    private bindEvents(): void {
        this.root
            .querySelector('.btn-next')
            .addEventListener('click', this.handleClickNextMonth);

        this.root
            .querySelector('.btn-prev')
            .addEventListener('click', this.handleClickPreviousMonth);

        this.root
            .querySelector('.input-date')
            .addEventListener('focusin', this.handleFocusInInputDate);

        this.debouncedHandleKeyupInputDate = debounce(
            (): void => {
                this.handleKeyUpInputDate();
            },
            1000,
            false,
        );

        this.root
            .querySelector('.input-date')
            .addEventListener('keyup', this.debouncedHandleKeyupInputDate);

        document.body.addEventListener('click', this.handleClickBody);
    }

    private unbindEvents(): void {
        this.root
            .querySelector('.btn-next')
            .removeEventListener('click', this.handleClickNextMonth);

        this.root
            .querySelector('.btn-prev')
            .removeEventListener('click', this.handleClickPreviousMonth);

        this.root
            .querySelector('.input-date')
            .removeEventListener('focusin', this.handleFocusInInputDate);

        this.root
            .querySelector('.input-date')
            .removeEventListener('keyup', this.debouncedHandleKeyupInputDate);

        document.body.removeEventListener('click', this.handleClickBody);
    }

    private handleClickNextMonth(): void {
        this.month = this.month.nextMonth();
        this.renderCalendar(this.month);
    }

    private handleClickPreviousMonth(): void {
        this.month = this.month.previousMonth();
        this.renderCalendar(this.month);
    }

    private handleFocusInInputDate(): void {
        const calendar: HTMLElement = this.root.querySelector('.calendar');
        calendar.style.display = 'block';
    }

    private handleClickBody(event: Event & { target: HTMLElement }): void {
        if (event.target === this) {
            return;
        }

        this.closeCalendar();
        this.month = Month.fromToday();
        this.renderCalendar(this.month);
    }

    private handleClickDay(event: Event & { target: HTMLElement }): void {
        this.selectDate(new Date(event.target.getAttribute('data-date')));
        this.closeCalendar();
    }

    private handleKeyUpInputDate(): void {
        const inputDate: HTMLInputElement = this.root.querySelector('.input-date');
        const timestamp = Date.parse(inputDate.value);

        if (isNaN(timestamp)) {
            return;
        }

        this.selectDate(new Date(timestamp));
    }

    private selectDate(selectedDate: Date): void {
        this.selectedDate =  selectedDate;

        const inputDate: HTMLInputElement = this.root
            .querySelector('.input-date');

        inputDate.value = this.selectedDate.toLocaleDateString();

        this.month = new Month(this.selectedDate);
        this.renderCalendar(this.month);
    }

    private closeCalendar(): void {
        const calendar: HTMLElement = this.root.querySelector('.calendar');
        calendar.style.display = 'none';
    }

    private renderCalendar(month: Month): void {
        this.renderMonthAndYear(month);
        this.renderWeeksAndDays(month);
    }

    private renderMonthAndYear(month: Month): void {
        this.root
            .querySelector('.calendar .month-and-year')
            .textContent = `${month.name()} - ${month.year()}`;
    }

    private renderWeeksAndDays(month: Month): void {
        this.root
            .querySelectorAll('.btn-day')
            .forEach((el: Element): void => {
                el.removeEventListener('click', this.handleClickDay);
            });

        this.root
            .querySelector('.calendar tbody')
            .innerHTML = '';

        const today = new Date();

        month.weeks().forEach((week) => {
            const weekEl = document.createElement('tr');

            week.build().forEach((day): void => {
                const dayEl = document.createElement('td');
                dayEl.classList.add('day');

                const dayButton = document.createElement('button');
                dayButton.title = day.toLocaleDateString();
                dayButton.innerText = day.getDate().toString();
                dayButton.setAttribute('data-date', day.toDateString());
                dayButton.classList.add('btn-day');

                dayEl.appendChild(dayButton);

                if (day.toDateString() === today.toDateString()) {
                    dayEl.classList.add('today');
                }

                if (undefined !== this.selectedDate && day.toDateString() === this.selectedDate.toDateString()) {
                    dayEl.classList.add('selected-day');
                }

                if (day.getMonth() !== this.month.month()) {
                    dayEl.classList.add('other-month');
                }

                weekEl.appendChild(dayEl);
            });

            this.root.querySelector('.calendar tbody').appendChild(weekEl);
        });

        this.root
            .querySelectorAll('.btn-day')
            .forEach((el: Element): void => {
                el.addEventListener('click', this.handleClickDay);
            });
    }
}
