"use strict";

const LOCALE = 'en';

const LocaleForMonths = new Intl.DateTimeFormat(LOCALE, { month: 'long' })
const LocaleForWeeks  = new Intl.DateTimeFormat(LOCALE, { weekday: 'narrow' })

const ThePresent = new (function(){
    this.DATE = new Date();
    this.YEAR = this.DATE.getFullYear();
    this.MONTH = this.DATE.getMonth();
    this.DAY = this.DATE.getDate();
})();

const UCalendar = new (function(){
    this.DaysOfTheWeekSlots = [0,1,2,3,4,5,6];
    this.MonthSlots         = [0,1,2,3,4,5,6,7,8,9,10,11];

    this.weekDays = this.DaysOfTheWeekSlots.map((dayIndex) => // This Speceific day starts on Monday
                        LocaleForWeeks.format(new Date(2022, 7, dayIndex + 1))
                    );

    this.getMonthCalendar = function(Year = ThePresent.YEAR, Month = ThePresent.MONTH){
        const currentDate = new Date(Year, Month, 1);
        return {
            startsOn: (currentDate.getDay() === 0) ? 7 : currentDate.getDay(),
            monthName: LocaleForMonths.format(currentDate),
            numberDaysInMonth: new Date(Year, Month + 1, 0).getDate(),
            monthId: Year + '-' + this.toValidDateNumber(Month + 1),
          }
    }

    this.getYearCalendar = function(Year = ThePresent.YEAR){
        return this.MonthSlots.map((monthIndex) => this.getMonthlyCalendar(Year, monthIndex));
    }

    this.toValidDateNumber = (number) =>{
        return ('' + number).length < 2 ? '0' + ('' + number): ('' + number);
    }
})();

const UICalendar = function(Options = false){
    const currentDate = new Date();
    const days = [...Array(30).keys()];

    this.UIDays = function(daysWrapper = 'li', Days = days, classNames = '', firstDayAttribites = ''){
        return Days.map((day, dayIndex) => 
        `<${daysWrapper} class="${dayIndex === 0 ? classNames + ' first-day' : classNames}" ${dayIndex === 0 && firstDayAttribites !== '' ? firstDayAttribites : ''}"> ${day + 1} </${daysWrapper}>`
        );
    }

    this.UIDaysOfWeek = function(daysWrapper = 'li', DayNames = UCalendar.weekDays, Attributes = null){
        return DayNames.map((dayName) => 
        `<${daysWrapper} ${Attributes ?? ''}> ${dayName} </${daysWrapper}>`
        );
    };

    this.MakeCalendar = function({monthId, monthName, startsOn}){
        return `
        <div data-month-id="${monthId}" class="calendar-front ${UCalendar.getMonthCalendar().monthName === monthName ? 'calendar-active': ''}">
            <div class="calendar__header">
              <div class="calendar-left-arrow cursor-pointer"><i class="fa-solid fa-chevron-left"></i></div>
                <div class="calendar__month_year">
                  <span class="calendar__month text-capitalize">${monthName}</span>
                  <span class="calendar__year">${2022}</span>
                </div>
              <div class="calendar-right-arrow cursor-pointer"><i class="fa-solid fa-chevron-right"></i></div>
            </div>
            <div class="calendar__days-container text-color-black-muted">
              <ol class="calendar__days text-bold">
                ${this.UIDaysOfWeek().join('')}
              </ol>
              <ol class="calendar__days calendar__numberDay text-color-black-muted text-bold">
                ${this.UIDays('li' , days , `month-day` , `style="--first-day-start: ${startsOn}"`).join('')}
              </ol>
            </div>

        </div>
  `;
    }

}

const calendar = new UICalendar();

console.log(calendar.MakeCalendar(UCalendar.getMonthCalendar()));

document.querySelector('#reservationCalendar').innerHTML = calendar.MakeCalendar(UCalendar.getMonthCalendar());
