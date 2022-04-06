"use strict";

const LOCALE_LANG = document.documentElement.lang || 'en';

const LocaleForMonths = new Intl.DateTimeFormat(LOCALE_LANG, { month: 'long' })
const LocaleForWeeks  = new Intl.DateTimeFormat(LOCALE_LANG, { weekday: 'narrow' })

const ThePresent = new (function(){
    this.DATE = new Date();
    this.YEAR = this.DATE.getFullYear();
    this.MONTH = this.DATE.getMonth();
    this.DAY = this.DATE.getDate();
})();

const UCalendar = new (function(){
    this.DaysOfTheWeekSlots = [0,1,2,3,4,5,6];
    this.MonthSlots         = [0,1,2,3,4,5,6,7,8,9,10,11];

    this.Now = function(){
        const DATE = new Date();
        const Year = DATE.getFullYear();
        const Month = DATE.getMonth();
        const Day = DATE.getDate();
        return {
          DATE,
          Year,
          Month,
          Day,
          localeMonth:  LocaleForMonths.format(new Date(Year, Month)),
        };
    };

    this.weekDays = this.DaysOfTheWeekSlots.map((dayIndex) => // This Speceific day starts on Monday
                        LocaleForWeeks.format(new Date(2022, 7, dayIndex + 1))
                    );

    this.getMonthCalendarInfo = function(Year = this.Now().Year, Month = this.Now().Month){
        const currentDate = new Date(Year, Month, 1);
        return {
            startsOn: (currentDate.getDay() === 0) ? 7 : currentDate.getDay(),
            monthName: LocaleForMonths.format(currentDate),
            numberDaysInMonth: new Date(Year, Month + 1, 0).getDate(),
            monthId: Year + '-' + this.toValidDateNumber(Month + 1),
            year: Year,
          }
    }

    this.getYearCalendarInfo = function(Year = this.Now().Year){
        return this.MonthSlots.map((monthIndex) => this.getMonthCalendarInfo(Year, monthIndex));
    }

    this.toValidDateNumber = (number) =>{
        return ('' + number).length < 2 ? '0' + ('' + number): ('' + number);
    }

    this.parseDate = function(calendarDate){
      const [year, month, day] = calendarDate.getAttribute('data-day-id').split('-');
      const ParsedDate = new Date(Number(year),Number(month - 1),Number(day));

      return {
        date: ParsedDate,
        dateElement: calendarDate,
        year: ParsedDate.getFullYear(),
        month: ParsedDate.getMonth(),
        monthName: LocaleForMonths.format(ParsedDate),
        day: ParsedDate.getDate(),
        addDays: function(days){
                    const newDate = new Date( +ParsedDate );
                    newDate.setDate(newDate.getDate() + Number(days));
                    return newDate;
                }
      }
    }

    this.isCalendarDate = function(element){
        return element.classList.contains('month-day');
    }

    this.isAfterToday = function(calendarDate){
      return calendarDate > UCalendar.Now().DATE;
    }

    this.areConsecutiveDates = function(day, nextDay){
    
    }
})();

const UICalendar = function({startsOn, monthName, numberDaysInMonth, monthId, year}){

    this.pickedDays = [];

    this.firstDayAttributes = `class='first-day month-day' style='--first-day-start: ${startsOn}'`;
    
    this.HtmlMonthDays = [...Array(numberDaysInMonth).keys()].map((dayIndex) =>
    `<li ${dayIndex === 0 ? this.firstDayAttributes : 'class="month-day"'} data-day-id="${monthId}-${UCalendar.toValidDateNumber(dayIndex + 1)}">${dayIndex + 1}</li>\n`
    );

    this.HtmlWeekDays = UCalendar.weekDays.map((dayName) => `<li class='day-name'>${dayName}</li> \n`);

    this.HtmlMonthCalendar = `
          <div data-month-id="${monthId}" class="calendar-front ${UCalendar.getMonthCalendarInfo().monthName === monthName ? 'calendar-active': 'calendar-active'}">
          <div class="calendar__header">
            <div class="calendar-left-arrow cursor-pointer"><i class="fa-solid fa-chevron-left"></i></div>
              <div class="calendar__month_year">
                <span class="calendar__month text-capitalize">${monthName}</span>
                <span class="calendar__year">${year}</span>
              </div>
            <div class="calendar-right-arrow cursor-pointer"><i class="fa-solid fa-chevron-right"></i></div>
          </div>
          <div class="calendar__days-container text-color-black-muted">
            <ol class="calendar__days text-bold">
                ${this.HtmlWeekDays.join('')}
            </ol>
            <ol class="calendar__days calendar__numberDay text-color-black-muted text-bold">
                ${this.HtmlMonthDays.join('')}
            </ol>
          </div>

      </div>
    `;

    this.createElement = (initObj)=> {
      var element = document.createElement(initObj.Tag);
      for (var prop in initObj) {
          if (prop === "childNodes") {
              initObj.childNodes.forEach(function (node) { element.appendChild(node); });
          }
          else if (prop === "attributes") {
              initObj.attributes.forEach(function (attr) { element.setAttribute(attr.key, attr.value) });
          }
          else element[prop] = initObj[prop];
      }
      return element;
  }

}

const UIFullCalendar = function({Year, target}){
    const _Year = Year || UCalendar.Now().Year;    
    const _target = target;

    const pickedDays = [];

    document.addEventListener('DOMContentLoaded', function(){

        if(typeof _target !== 'object') return null;

        _target.addEventListener('click', function(e){
          
            if(!UCalendar.isCalendarDate(e.target)) return null;

            const pickedDay = UCalendar.parseDate(e.target);

            if(!UCalendar.isAfterToday(pickedDay.date)) return null;

            pickedDay.dateElement.classList.add('calendar__day-selected');
            
            console.log(pickedDay.date);
            console.log(pickedDay.addDays(1));

            pickedDays.push(pickedDay);

            console.log(pickedDays);
        })
    })

    this.HtmlCalendar = UCalendar.getYearCalendarInfo(_Year).map((element) =>new UICalendar(element, target).HtmlMonthCalendar);

    _target.innerHTML = this.HtmlCalendar.join('');
}