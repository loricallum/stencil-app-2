const h = window.App.h;

import dateFns from 'date-fns';

class Datepicker {
    constructor() {
        this.dateObj = {
            todaysDate: dateFns.format(new Date(), 'MM/DD/YYYY'),
            firstDate: dateFns.format(new Date(), 'MM/DD/YYYY'),
            firstDateYear: parseInt(dateFns.format(new Date(), 'YYYY')),
            firstDateMonth: parseInt(dateFns.format(new Date(), 'M')),
            firstDateDay: parseInt(dateFns.format(new Date(), 'D')),
            selectedDate: null,
            secondDate: dateFns.format(dateFns.addMonths(new Date(), 1), 'MM/DD/YYYY'),
            secondDateYear: parseInt(dateFns.format(dateFns.addMonths(new Date(), 1), 'YYYY')),
            secondDateMonth: parseInt(dateFns.format(dateFns.addMonths(new Date(), 1), 'M')),
            secondDateDay: parseInt(dateFns.format(dateFns.addMonths(new Date(), 1), 'D'))
        };
        this.datesObj = {
            firstDate: null,
            secondDate: null,
            hoveredDate: null
        };
        this._clickOffDatepickerHandler = (e) => {
            if (e.target.closest('div.datepicker') == null) {
                this._closeDatepicker();
            }
        };
        this._setWindowWidth = () => {
            this.innerWidth = window.innerWidth || document.body.clientWidth;
        };
        this._createTRs = () => {
            let currentDatepicker = document.querySelector(`datepicker[datepicker-id='${this.DatepickerId}']`);
            let months = currentDatepicker.querySelectorAll('.month-container');
            for (let idx = 0; idx < months.length; idx++) {
                const currentMonth = months[idx];
                const currentTbody = currentMonth.querySelector('tbody');
                const currentTds = currentMonth.querySelectorAll('td');
                let tr = document.createElement('tr');
                for (let j = 0; j < currentTds.length; j++) {
                    const currentTd = currentTds[j];
                    if (j % 7 === 0 && j > 0) {
                        currentTbody.appendChild(tr);
                        tr = document.createElement('tr');
                    }
                    tr.appendChild(currentTd);
                }
                // append finalRow
                currentTbody.appendChild(tr);
            }
        };
    }
    singleDateSelectedHandler(event) {
        let selectedDay = parseInt(event.detail.innerHTML);
        let newDate;
        if (event.srcElement.getAttribute('data-second-month-header')) {
            newDate = dateFns.format(new Date(this.dateObj.secondDateYear, this.dateObj.secondDateMonth - 1, selectedDay), 'MM/DD/YYYY');
        }
        else {
            newDate = dateFns.format(new Date(this.dateObj.firstDateYear, this.dateObj.firstDateMonth - 1, selectedDay), 'MM/DD/YYYY');
        }
        this.dateObj = Object.assign({}, this.dateObj, { firstDate: newDate, firstDateDay: selectedDay, selectedDate: newDate });
        this._closeDatepicker();
        let evt = {
            selectedDate: this.dateObj.selectedDate,
            datepickerId: this.DatepickerId
        };
        this.dateSelected.emit(evt);
        console.log('date obj', this.dateObj);
        console.log('date', this.dateObj.firstDate);
        console.log('selectedDate', this.dateObj.selectedDate);
    }
    multiDateSelectedHandler(event) {
        let selectedDay = parseInt(event.detail.innerHTML);
        let newDate;
        if (event.srcElement.getAttribute('data-second-month-header')) {
            newDate = dateFns.format(new Date(this.dateObj.secondDateYear, this.dateObj.secondDateMonth - 1, selectedDay), 'MM/DD/YYYY');
        }
        else {
            newDate = dateFns.format(new Date(this.dateObj.firstDateYear, this.dateObj.firstDateMonth - 1, selectedDay), 'MM/DD/YYYY');
        }
        if (this.datesObj.firstDate && this.datesObj.secondDate || dateFns.isBefore(new Date(newDate), new Date(this.datesObj.firstDate))) {
            this.datesObj = Object.assign({}, this.datesObj, { firstDate: newDate, secondDate: '' });
        }
        else if (!this.datesObj.firstDate) {
            this.datesObj = Object.assign({}, this.datesObj, { firstDate: newDate });
        }
        else {
            this.datesObj = Object.assign({}, this.datesObj, { secondDate: newDate });
        }
        let evt = Object.assign({}, this.datesObj, { datepickerId: this.DatepickerId });
        this.dateSelected.emit(evt);
        console.log('dates obj', this.datesObj);
    }
    multiDateHoverHandler(event) {
        let hoveredDay = parseInt(event.detail.innerHTML);
        let hoveredDate;
        if (event.srcElement.getAttribute('data-second-month-header')) {
            hoveredDate = dateFns.format(new Date(this.dateObj.secondDateYear, this.dateObj.secondDateMonth - 1, hoveredDay), 'MM/DD/YYYY');
        }
        else {
            hoveredDate = dateFns.format(new Date(this.dateObj.firstDateYear, this.dateObj.firstDateMonth - 1, hoveredDay), 'MM/DD/YYYY');
        }
        this.datesObj = Object.assign({}, this.datesObj, { hoveredDate });
    }
    mouseOutHandler() {
        this.datesObj = Object.assign({}, this.datesObj, { hoveredDate: null });
    }
    monthChangedHandler(event) {
        let newYear = this.dateObj.firstDateYear;
        let newMonth;
        let newDate;
        switch (event.detail) {
            case 'plus':
                newMonth = this.dateObj.firstDateMonth + 1;
                if (newMonth > 12) {
                    newYear = this.dateObj.firstDateYear + 1;
                    newMonth = 1;
                }
                this.dateObj = Object.assign({}, this.dateObj, { firstDate: dateFns.format(new Date(newYear, newMonth - 1), 'MM/DD/YYYY'), firstDateMonth: newMonth, firstDateYear: newYear });
                newDate = dateFns.format(dateFns.addMonths(this.dateObj.firstDate, 1), 'MM/DD/YYYY');
                this.dateObj = Object.assign({}, this.dateObj, { secondDate: newDate, secondDateYear: parseInt(dateFns.format(newDate, 'YYYY')), secondDateMonth: parseInt(dateFns.format(newDate, 'M')) });
                console.log('date obj', this.dateObj);
                console.log('date', this.dateObj.firstDate);
                console.log('selectedDate', this.dateObj.selectedDate);
                break;
            case 'minus':
                if (this.dateObj.firstDateMonth === 1) {
                    newMonth = 12;
                    newYear = this.dateObj.firstDateYear - 1;
                }
                else {
                    newMonth = (this.dateObj.firstDateMonth - 1) % 12;
                }
                this.dateObj = Object.assign({}, this.dateObj, { firstDate: dateFns.format(new Date(newYear, newMonth - 1), 'MM/DD/YYYY'), firstDateMonth: newMonth, firstDateYear: newYear ? newYear : this.dateObj.firstDateYear });
                newDate = dateFns.format(dateFns.addMonths(this.dateObj.firstDate, 1), 'MM/DD/YYYY');
                this.dateObj = Object.assign({}, this.dateObj, { secondDate: newDate, secondDateYear: parseInt(dateFns.format(newDate, 'YYYY')), secondDateMonth: parseInt(dateFns.format(newDate, 'M')) });
                console.log('date obj', this.dateObj);
                console.log('date', this.dateObj.firstDate);
                console.log('selectedDate', this.dateObj.selectedDate);
                break;
            default:
                break;
        }
    }
    componentWillLoad() {
        this._setWindowWidth();
    }
    componentDidLoad() {
        this._createTRs();
        document.addEventListener('click', this._clickOffDatepickerHandler);
        document.addEventListener('dateSelected', (e) => {
            console.log('event dispatched is', e);
        });
    }
    componentDidUnload() {
        document.removeEventListener('click', this._clickOffDatepickerHandler);
    }
    _toggleDatepicker(e) {
        let datepickerContainer = e.target.nextSibling;
        let displayStyle = datepickerContainer.getAttribute('style') ? '' : 'display: inline-block !important';
        datepickerContainer.setAttribute('style', displayStyle);
    }
    _closeDatepicker() {
        let datepickerElements = document.querySelectorAll('.datepicker-container');
        for (let idx = 0; idx < datepickerElements.length; idx++) {
            const datepicker = datepickerElements[idx];
            datepicker.setAttribute('style', '');
        }
        if (this.datesObj.firstDate && !this.datesObj.secondDate) {
            this.datesObj = {
                firstDate: null,
                secondDate: null,
                hoveredDate: null
            };
        }
    }
    _clearDates(e) {
        e.preventDefault();
        this.dateObj = Object.assign({}, this.dateObj, { selectedDate: null });
        this.datesObj = Object.assign({}, this.datesObj, { firstDate: null, secondDate: null, hoveredDate: null });
    }
    _applyDates(e) {
        e.preventDefault();
        e = Object.assign({}, e, { target: e.target.parentElement.parentElement.previousSibling });
        this._toggleDatepicker(e);
    }
    render() {
        const currentMonth = this.dateObj.firstDateMonth - 1;
        const offset = dateFns.getISODay(new Date(this.dateObj.firstDateYear, currentMonth, 1));
        const offsetTwo = dateFns.getISODay(new Date(this.dateObj.firstDateYear, currentMonth + 1, 1));
        const lastMonth = currentMonth - 1 < 0 ? 11 : currentMonth - 1;
        const lastYear = this.dateObj.firstDateYear - 1;
        const minimumDate = this.minDate === 'default' ? new Date(this.dateObj.firstDate) : new Date(this.minDate);
        const minYear = minimumDate.getFullYear();
        const minMonth = minimumDate.getMonth() + 1;
        const minDay = minimumDate.getUTCDate();
        const maximumDate = new Date(this.maxDate);
        const maxYear = maximumDate.getFullYear();
        const maxMonth = maximumDate.getMonth() + 1;
        const maxDay = maximumDate.getUTCDate();
        const dateRestrictionObj = {
            minimumDate,
            minYear,
            minMonth,
            minDay,
            maximumDate,
            maxYear,
            maxMonth,
            maxDay
        };
        return (h("div", { class: `datepicker ${this.innerWidth < 800 ? 'mobile-view' : ''}` },
            h("p", { class: 'selected-date', onClick: this._toggleDatepicker },
                !this.multiDate ? this.dateObj.selectedDate || 'Select Date' : `${this.datesObj.firstDate || 'Start Date'} - ${this.datesObj.secondDate || 'End Date'}`,
                h("svg", { version: "1.0", xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 2000.000000 2000.000000", preserveAspectRatio: "xMidYMid meet" },
                    h("g", { transform: "translate(0.000000,2000.000000) scale(0.100000,-0.100000)", fill: "#000000", stroke: "#000000" },
                        h("path", { d: "M6500 19155 c-341 -76 -592 -330 -656 -663 -11 -57 -14 -179 -14 -533 l0 -459 -920 0 c-964 0 -1018 -2 -1240 -46 -499 -98 -952 -348 -1315 -726 -235 -245 -422 -543 -540 -862 -50 -137 -109 -375 -132 -531 -17 -125 -18 -355 -18 -6175 0 -5668 1 -6052 17 -6157 24 -159 64 -330 104 -451 201 -601 598 -1085 1147 -1399 295 -168 663 -283 1007 -313 90 -8 1815 -10 6140 -8 5724 3 6020 4 6120 21 58 10 161 32 229 48 458 112 899 367 1218 703 396 419 633 947 683 1526 14 158 14 11911 0 12070 -54 617 -316 1174 -751 1596 -379 366 -808 581 -1359 681 -85 15 -202 17 -1072 20 l-978 4 0 459 c0 354 -3 475 -14 532 -80 411 -442 696 -860 675 -213 -11 -378 -78 -528 -216 -110 -102 -188 -225 -239 -376 -23 -69 -24 -76 -27 -572 l-3 -503 -2499 0 -2499 0 -3 503 c-3 496 -4 503 -27 572 -51 151 -129 274 -239 376 -105 97 -211 154 -358 195 -83 22 -291 28 -374 9z m-668 -3817 c4 -476 5 -496 26 -566 89 -293 306 -505 597 -583 108 -29 297 -32 405 -5 101 24 261 103 338 166 135 110 241 281 282 450 18 79 20 118 20 558 l0 472 2500 0 2500 0 0 -472 c0 -440 2 -479 20 -558 40 -169 143 -334 278 -446 80 -66 238 -145 342 -170 108 -27 297 -24 405 5 291 78 508 290 597 583 21 70 22 90 26 566 l3 493 897 -3 c1006 -4 938 1 1112 -80 243 -112 415 -333 466 -596 12 -61 14 -295 14 -1363 l0 -1289 -6660 0 -6660 0 0 1289 c0 1395 -1 1358 54 1505 85 225 278 411 511 491 121 42 154 43 1057 44 l867 1 3 -492z m10826 -8330 l-3 -3823 -23 -73 c-46 -149 -125 -275 -239 -383 -108 -102 -221 -162 -383 -206 -62 -17 -377 -18 -5925 -21 -3847 -2 -5899 1 -5972 7 -206 19 -369 90 -510 225 -114 107 -189 228 -235 378 l-23 73 -3 3823 -2 3822 6660 0 6660 0 -2 -3822z" })))),
            h("div", { class: 'datepicker-container' },
                h("div", { class: `mobile-date-header ${this.innerWidth < 800 ? '' : 'hide'}` },
                    h("p", null, !this.multiDate ? this.dateObj.selectedDate || 'Select Date' : `${this.datesObj.firstDate || 'Start Date'} - ${this.datesObj.secondDate || 'End Date'}`)),
                h("div", { class: 'month-container first-month-container' },
                    h("month-header", { year: this.dateObj.firstDateYear, month: this.dateObj.firstDateMonth - 1, mobile: this.innerWidth < 800 }),
                    h("datepicker-week", { mobile: this.innerWidth < 800 }),
                    h("week-header", { date: this.dateObj.firstDate, datesObj: this.datesObj, day: this.dateObj.firstDateDay, daysInMonth: dateFns.getDaysInMonth(new Date(this.dateObj.firstDateYear, currentMonth)), lastDay: dateFns.getDaysInMonth(new Date(lastYear, lastMonth)), lastDayOfMonth: dateFns.lastDayOfMonth(new Date(this.dateObj.firstDateYear, this.dateObj.firstDateMonth, 0, 0, 0, 0)), dateRestrictionObj: dateRestrictionObj, month: this.dateObj.firstDateMonth, multidate: this.multiDate, offset: offset, selectedDate: this.dateObj.selectedDate, todaysDate: this.dateObj.todaysDate, year: this.dateObj.firstDateYear })),
                h("div", { class: 'month-container second-month-container' },
                    h("month-header", { year: this.dateObj.secondDateYear, month: this.dateObj.secondDateMonth - 1, mobile: this.innerWidth < 800, secondMonthHeader: true }),
                    h("datepicker-week", { mobile: this.innerWidth < 800 }),
                    h("week-header", { "data-second-month-header": true, date: this.dateObj.secondDate, datesObj: this.datesObj, day: this.dateObj.secondDateDay, daysInMonth: dateFns.getDaysInMonth(new Date(this.dateObj.secondDateYear, currentMonth + 1)), lastDay: dateFns.getDaysInMonth(new Date(lastYear, lastMonth)), lastDayOfMonth: dateFns.lastDayOfMonth(new Date(this.dateObj.secondDateYear, this.dateObj.secondDateMonth, 0, 0, 0, 0)), dateRestrictionObj: dateRestrictionObj, month: this.dateObj.secondDateMonth, multidate: this.multiDate, offset: offsetTwo, selectedDate: this.dateObj.selectedDate, todaysDate: this.dateObj.todaysDate, year: this.dateObj.secondDateYear })),
                h("div", { class: "buttons-container" },
                    h("button", { onClick: (e) => this._clearDates(e) }, "Clear"),
                    this.multiDate ? h("button", { disabled: !this.datesObj.firstDate || !this.datesObj.secondDate, onClick: (e) => this._applyDates(e) }, "Apply")
                        : ''))));
    }
    static get is() { return "datepicker"; }
    static get properties() { return {
        "dateObj": {
            "state": true
        },
        "DatepickerId": {
            "type": "Any",
            "attr": "datepicker-id"
        },
        "datesObj": {
            "state": true
        },
        "innerWidth": {
            "state": true
        },
        "maxDate": {
            "type": String,
            "attr": "max-date"
        },
        "minDate": {
            "type": String,
            "attr": "min-date"
        },
        "multiDate": {
            "type": Boolean,
            "attr": "multi-date"
        }
    }; }
    static get events() { return [{
            "name": "dateSelected",
            "method": "dateSelected",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
    static get listeners() { return [{
            "name": "singleDateSelected",
            "method": "singleDateSelectedHandler"
        }, {
            "name": "multiDateSelected",
            "method": "multiDateSelectedHandler"
        }, {
            "name": "multiDateHover",
            "method": "multiDateHoverHandler"
        }, {
            "name": "mouseOut",
            "method": "mouseOutHandler",
            "passive": true
        }, {
            "name": "monthChanged",
            "method": "monthChangedHandler"
        }]; }
    static get style() { return "\@import 'color-library';\n\n.datepicker {\n  \n  position: relative;\n  font-size: 16px !important;\n  width: 300px !important;\n\n  .hide {\n    display: none;\n  }\n\n  .selected-date {\n    border: 2px solid green;\n    color: $color-rolling-stone;\n    display: flex;\n    font-size: 22px;\n    justify-content: space-between;\n    padding: 10px;\n    // width: 300px;\n\n    svg {\n      width: 30px !important;\n      height: 25px !important;\n      pointer-events: none;\n    }\n\n    &:hover {\n      cursor: pointer;\n    }\n  }\n\n  .buttons-container {\n    display: flex;\n    justify-content: space-between;\n    margin: 15px 0;\n  }\n\n  .datepicker-container {\n    display: none;\n    position: absolute;\n    left: 0px;\n    z-index: 10 !important;\n    background: #ffffff;\n    border: 1px solid rgba(0, 0, 0, 0.2);\n    border-radius: 4px;\n    box-shadow: 0 14px 36px 2px rgba(0, 0, 0, 0.15);\n    padding: 1.5em;\n    overflow-y: auto;\n    overflow-x: hidden;\n    white-space: normal;\n    text-align: center;\n    top: 90px;\n    width: 620px;\n    visibility: visible;\n\n    .mobile-date-header {\n      display: flex;\n\n      &.hide {\n        display: none;\n      }\n    }\n\n    .month-container {\n      display: inline-block;\n      width: calc(50% - 10px);\n\n      &.first-month-container {\n        margin-right: 10px;\n      }\n      &.second-month-container {\n        margin-left: 10px;\n      }\n    }\n  }\n\n  &.mobile-view {\n    width: 100% !important;\n\n    .datepicker-container {\n      position: fixed !important;\n      top: 0px !important;\n      height: 100%;\n      padding: 0;\n\n      .mobile-date-header {\n        justify-content: center;\n        align-items: center;\n\n        p {\n          font-size: .875em;\n        }\n      }\n\n      .month-container {\n        display: block;\n        width: 80%;\n        margin: 0 auto;\n      }\n    }\n  }\n}"; }
}

class DatepickerWeek {
    _sayDay() {
        console.log(this);
    }
    render() {
        const days = {
            'Su': 'S',
            'Mo': 'M',
            'Tu': 'T',
            'We': 'W',
            'Th': 'T',
            'Fr': 'F',
            'Sa': 'S',
        };
        return (h("div", { class: 'datepicker-week-container' }, Object.keys(days).map(day => {
            return (h("th", { class: 'datepicker-week-header' },
                h("h5", null, this.mobile ? days[day] : day)));
        })));
    }
    static get is() { return "datepicker-week"; }
    static get properties() { return {
        "mobile": {
            "type": Boolean,
            "attr": "mobile"
        }
    }; }
    static get style() { return "datepicker-week .datepicker-week-container {\n    display: flex;\n  \n    th {\n      color: $color-midnight;\n      flex: 1 1 0;\n      // padding: 12px 0;\n    }\n  }"; }
}

class MonthHeader {
    monthChangedHandler(arrowDirection) {
        this.monthChanged.emit(arrowDirection);
    }
    render() {
        const months = {
            0: 'January',
            1: 'February',
            2: 'March',
            3: 'April',
            4: 'May',
            5: 'June',
            6: 'July',
            7: 'August',
            8: 'September',
            9: 'October',
            10: 'November',
            11: 'December'
        };
        // if first month header, left arrow. Otherwise, right arrow
        let arrow = this.secondMonthHeader ? h("p", { onClick: this.monthChangedHandler.bind(this, 'plus') }, "\u2192") : h("p", { onClick: this.monthChangedHandler.bind(this, 'minus') }, "\u2190");
        if (this.mobile && this.secondMonthHeader) {
            // down arrow if its the second monthHeader & on mobile
            arrow = h("p", { onClick: this.monthChangedHandler.bind(this, 'plus') }, "\u2193");
        }
        else if (this.mobile && !this.secondMonthHeader) {
            arrow = h("p", { onClick: this.monthChangedHandler.bind(this, 'minus') }, "\u2191");
        }
        return (h("div", { class: 'month-header' },
            this.secondMonthHeader ? '' : arrow,
            h("h3", null, `${months[this.month]} ${this.year}` || 'Month Header'),
            this.secondMonthHeader ? arrow : ''));
    }
    static get is() { return "month-header"; }
    static get properties() { return {
        "mobile": {
            "type": Boolean,
            "attr": "mobile"
        },
        "month": {
            "type": Number,
            "attr": "month"
        },
        "secondMonthHeader": {
            "type": Boolean,
            "attr": "second-month-header"
        },
        "year": {
            "type": Number,
            "attr": "year"
        }
    }; }
    static get events() { return [{
            "name": "monthChanged",
            "method": "monthChanged",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
    static get style() { return ".month-header {\n    display: flex;\n    justify-content: space-between;\n    align-items: center;\n    color: #565a5c;\n    text-align: center;\n    padding-top: 22px;\n    padding-bottom: 37px;\n    caption-side: initial;\n  \n    p {\n      border: 1px solid #c4c4c4;\n      color: $color-midnight;\n      display: flex;\n      justify-content: center;\n      align-items: center;\n      min-height: 2.3em;\n      min-width: 2em;\n  \n      &:hover {\n        cursor: pointer;\n      }\n    }\n  \n    h3 {\n      min-width: 10em;\n    }\n  }\n  \n  \@media (max-width: 800px) {\n    .month-container {\n      position: relative;\n  \n      &.first-month-container {\n        padding-top: 60px;\n  \n        .month-header p {\n          top: 0;\n        }\n      }\n  \n      .month-header {\n        flex-direction: column;\n        padding: 0;\n  \n        p {\n          position: absolute;\n          width: 100%;\n          padding: 10px;\n          margin: 0;\n        }\n      }\n    }\n  \n  \n    .second-month-container {\n      padding-bottom: 75px;\n      p {\n        bottom: 0;\n      }\n    }\n  }"; }
}

class WeekHeader {
    singleDateSelectedHandler(evt) {
        this.singleDateSelected.emit(evt.target);
    }
    multiDateSelectedHandler(evt) {
        this.multiDateSelected.emit(evt.target);
    }
    multiDateHoverHandler(evt) {
        this.multiDateHover.emit(evt.target);
    }
    mouseOutHandler(evt) {
        this.mouseOut.emit(evt.target);
    }
    render() {
        let rows = [];
        let lastDay = this.lastDay - this.offset;
        let firstDay = 1;
        let offset = this.offset % 7;
        for (let blank = 0; blank < offset; blank++) {
            rows.push(h("td", { class: 'empty last-month' },
                h("p", null, lastDay + 1)));
            lastDay++;
        }
        for (let day = 1; day <= this.daysInMonth; day++) {
            let className = 'week-header';
            let selectedDay, selectedMonth, selectedYear, selected;
            //beforeDate,
            // afterDate;
            const currentDate = new Date(this.year, this.month - 1, day);
            const maxDate = new Date(this.dateRestrictionObj.maximumDate);
            const minDate = new Date(this.dateRestrictionObj.minimumDate);
            let todaysDate = dateFns.isEqual(currentDate, this.todaysDate);
            if (dateFns.isAfter(minDate, currentDate) || dateFns.isBefore(maxDate, currentDate)) {
                rows.push(h("td", { class: 'empty' },
                    h("p", null, day)));
            }
            else {
                if (this.datesObj.firstDate && this.datesObj.secondDate) {
                    if (h("dateFns", { className: "isWithinRange" }))
                        new Date(this.year, this.month - 1, day), new Date(this.datesObj.firstDate), new Date(this.datesObj.secondDate);
                    {
                        selected = true;
                    }
                    {
                        selected = false;
                    }
                }
                else if (this.datesObj.firstDate && this.datesObj.hoveredDate) {
                    selectedDay = new Date(this.datesObj.firstDate).getUTCDate();
                    selectedMonth = dateFns.getMonth(this.datesObj.firstDate) + 1;
                    selectedYear = dateFns.getYear(this.datesObj.firstDate);
                    selected = (selectedDay === day && selectedMonth === this.month && selectedYear === this.year);
                    if (dateFns.isBefore(currentDate, this.datesObj.firstDate)) {
                        className += ' before-date ';
                        todaysDate = false;
                    }
                    else if (dateFns.isAfter(dateFns.addDays(this.datesObj.hoveredDate, 1), currentDate) && dateFns.isAfter(currentDate, this.datesObj.firstDate)) {
                        className += ' after-date ';
                        todaysDate = false;
                    }
                }
                else {
                    if (this.selectedDate || this.datesObj.firstDate) {
                        let selectedDate = this.selectedDate || this.datesObj.firstDate;
                        selectedDay = new Date(selectedDate).getUTCDate();
                        selectedMonth = dateFns.getMonth(selectedDate) + 1;
                        selectedYear = dateFns.getYear(selectedDate);
                        selected = (selectedDay === day && selectedMonth === this.month && selectedYear === this.year);
                    }
                }
                if (selected) {
                    className += ' selected ';
                    todaysDate = false;
                }
                if (todaysDate) {
                    className += ' today ';
                }
                rows.push(h("td", { class: className, onClick: this.multidate ? this.multiDateSelectedHandler.bind(this) : this.singleDateSelectedHandler.bind(this), onMouseOver: this.multidate && this.datesObj.firstDate && this.multiDateHoverHandler.bind(this), onMouseOut: this.mouseOutHandler.bind(this) },
                    h("p", null, day)));
            }
        }
        for (let lastDayDate = this.lastDayOfMonth.getDay(); lastDayDate < 6; lastDayDate++) {
            rows.push(h("td", { class: 'empty next-month' },
                h("p", null, firstDay)));
            firstDay++;
        }
        return (h("table", { id: 'my-table' },
            h("tbody", { class: 'week-header-container' }, rows)));
    }
    static get is() { return "week-header"; }
    static get properties() { return {
        "date": {
            "type": "Any",
            "attr": "date"
        },
        "dateRestrictionObj": {
            "type": "Any",
            "attr": "date-restriction-obj"
        },
        "datesObj": {
            "type": "Any",
            "attr": "dates-obj"
        },
        "day": {
            "type": Number,
            "attr": "day"
        },
        "daysInMonth": {
            "type": Number,
            "attr": "days-in-month"
        },
        "lastDay": {
            "type": Number,
            "attr": "last-day"
        },
        "lastDayOfMonth": {
            "type": "Any",
            "attr": "last-day-of-month"
        },
        "month": {
            "type": Number,
            "attr": "month"
        },
        "multidate": {
            "type": Boolean,
            "attr": "multidate"
        },
        "offset": {
            "type": Number,
            "attr": "offset"
        },
        "selectedDate": {
            "type": "Any",
            "attr": "selected-date"
        },
        "todaysDate": {
            "type": String,
            "attr": "todays-date"
        },
        "year": {
            "type": Number,
            "attr": "year"
        }
    }; }
    static get events() { return [{
            "name": "singleDateSelected",
            "method": "singleDateSelected",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "multiDateSelected",
            "method": "multiDateSelected",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "multiDateHover",
            "method": "multiDateHover",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "mouseOut",
            "method": "mouseOut",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
    static get style() { return "#my-table {\n    width: 100%;\n    border-collapse: collapse !important;\n    border-spacing: 0px !important;\n  \n    td {\n      border: 1px solid #e4e7e7 !important;\n  \n      p {\n        padding: 12px 0;\n        // height: 38px;\n        // width: 39px;\n        box-sizing: border-box !important;\n        color: $color-midnight;\n        font-size: 14px !important;\n        text-align: center !important;\n        margin: 0;\n      }\n  \n      &.today {\n        background-color: $color-azure;\n        border-color: $color-azure;\n        opacity: 0.5;\n  \n        p {\n          color: white;\n        }\n      }\n  \n      &.week-header {\n        &:hover {\n          cursor: pointer;\n        }\n  \n        &.after-date {\n          background-color: $color-azure;\n          opacity: 0.5;\n        }\n  \n        &.selected,\n        &.after-date {\n          background-color: $color-azure;\n          p {\n            color: $color-zircon;\n          }\n        }\n  \n        &.before-date:hover {\n          background-color: $color-heather;\n        }\n      }\n    }\n  }\n  \n  .empty {\n    color: #bbbbbb;\n    visibility: hidden;\n  \n    &.last-month {\n      color: #f3f0f0;\n    }\n  \n    &.next-month {\n      color: #f3f0f0;\n    }\n  \n    &:hover {\n      cursor: not-allowed;\n    }\n  }\n  \n  \@media (max-width: 800px) {\n    #my-table {\n      td {\n        width: 70px;\n        height: 69px;\n      }\n    }\n  }"; }
}

export { Datepicker, DatepickerWeek, MonthHeader, WeekHeader };
