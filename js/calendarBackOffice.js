/**
 * Next feature:
 * .- Done Show just one calendar month in html at time
 *      add functionality to arrows in calendar header
 * .- Done - Validate that selected days are consecutives Yes:1-2-3, No: 1-2-5
 *      reset calendar selection if days are not consecutive
 * .- Done repeated days
 *      and remove from final selected days
 * .- Show Selected Period below Calendar
 *      DD/MM/YYYY - Start Date: 01/03/2022 End Date: 03/03/2022
 *      Alternativa: 1 al 3 de Mayo.
 *      
*/

/* Base Calendar Html Container */
const calendarElement = document.querySelector('#reservationCalendar');

/* Store calendar dates picked from frontpage */
let selectedDate = [];

/* Localization settings */
const locale = 'en';

/**
 * Year & Array with 12 empty slots to save the months with their translations.
 * months constant will help store the translated months 
 * with the native Intl js object below
*/

const actualYear    = 2022;
const months        = [0,1,2,3,4,5,6,7,8,9,10,11]; // slots for months
const daysOfTheWeek = [0,1,2,3,4,5,6]; // slots for days of the week

/* Settings to Format JS dates with Localization settings above */
// months and week days are "0 indexed" (starts on zero);
const intlForMonths = new Intl.DateTimeFormat(locale, { month: 'long' })
const intlForWeeks  = new Intl.DateTimeFormat(locale, { weekday: 'narrow' })

/**
 * WeekDyas Auto-Translated with Native JS Date Object
 * Formatted with Intl object to help with localization 
*/
const weekDays = daysOfTheWeek.map((dayIndex) =>
  intlForWeeks.format(new Date(actualYear, 7, dayIndex + 1))
  // Here we need a month that starts on Monday 
  // to return the days from Monday to Sunday 
)

/**
 * Main function where we get the Calendar Real Data.
*/

const monthlyCalendar = (Year = 2022, Month = 0) => { 
  const baseDate = new Date(Year, Month);
    return {
      startsOn: (baseDate.getDay() === 0) ? 7 : baseDate.getDay(),
      monthName: intlForMonths.format(baseDate),
      numberDaysInMonth: new Date(Year, Month + 1, 0).getDate(),
      monthId: baseDate.getFullYear()+ '-' + toValidDateNumber((baseDate.getMonth() + 1)),
    }
}

const yearCalendar = (Year = 2022) => {
  const Months = [0,1,2,3,4,5,6,7,8,9,10,11]; // slots for months
  const calendar = Months.map((monthIndex) => monthlyCalendar(Year, monthIndex))

  return calendar;
}

const calendar = months.map((monthIndex) => {
  const monthName = intlForMonths.format(new Date(actualYear, monthIndex));
  const nextMonthIndex = (monthIndex + 1) % 12;
  const daysOfMonth = new Date(actualYear, nextMonthIndex, 0).getDate();
  const startsOn = new Date(actualYear, monthIndex, 1).getDay();
  return {
    startsOn: (startsOn === 0 ? 7 : startsOn), // Sunday in js is index 0 so we need to change it to 7 so that it takes its rightful place in the calendar
    monthName,
    daysOfMonth,
    monthId: new Date().getFullYear() + '-' + toValidDateNumber(monthIndex + 1)
  }
})

  /**
   * Make The html with Real Calendar Data.
  */

const MakeCalendar = calendar.map(({ daysOfMonth, monthName, startsOn,monthId }) => {
    const currentDate = new Date();

    const days = [...Array(daysOfMonth).keys()];

    const firstDayAttributes = `class='first-day month-day' style='--first-day-start: ${startsOn}'`;
    
    const htmlDaysName = weekDays
                        .map((dayName) => `<li class='day-name'>${dayName}</li>`)
                        .join('');

    const htmlDays = days
                      .map((day, index) =>
                          `<li ${index === 0 ? firstDayAttributes : 'class="month-day"'} data-day-id="${monthId}-${toValidDateNumber(day + 1)}">${day + 1}</li>`
                      )
                      .join('')

    return `
          <div data-month-id="${monthId}" class="calendar-front ${calendar[currentDate.getMonth()].monthName === monthName ? 'calendar-active': ''}">
              <div class="calendar__header">
                <div class="calendar-left-arrow cursor-pointer"><i class="fa-solid fa-chevron-left"></i></div>
                  <div class="calendar__month_year">
                    <span class="calendar__month text-capitalize">${monthName}</span>
                    <span class="calendar__year">${actualYear}</span>
                  </div>
                <div class="calendar-right-arrow cursor-pointer"><i class="fa-solid fa-chevron-right"></i></div>
              </div>
              <div class="calendar__days-container text-color-black-muted">
                <ol class="calendar__days text-bold">
                  ${htmlDaysName}
                </ol>
                <ol class="calendar__days calendar__numberDay text-color-black-muted text-bold">
                  ${htmlDays}
                </ol>
              </div>

          </div>
    `;
});

/**
 * Finally attaching the previously made calendar to the DOM
*/
document.querySelector('#reservationCalendar').innerHTML = MakeCalendar.join('');

// Calendar API to get Selected Date

calendarElement.addEventListener('click', function(e){
    const currentCalendarActive = document.querySelector('.calendar-active');
    if(e.target.classList.contains('month-day')){
        let daysWithActiveClass = document.querySelectorAll('.calendar__day-selected');
        let day = e.target;

        /**
         *  First check if the selected date is an available day.
         *  If not, we don't add date.
         */
        if(!isAvailableDate(parseCalendar(day))){
          console.log('Is Not Available day & Date selection: ', selectedDate);
          return null;
        }

        /* If not select next day consecutively, restart selection from last selected day*/
        if(!isConsecutiveDate(selectedDate)){
            selectedDate = [];
            for(let i = 0; i < daysWithActiveClass.length; i++){
              daysWithActiveClass[i].classList.remove('calendar__day-selected');
            }
            getCalendarSelection(day);
            e.target.classList.add('calendar__day-selected')
            console.log('Is not consecutive & date Selection: ', selectedDate)
            return null;
        }

        /**
         * Add a validated date
         */
        getCalendarSelection(day);
        console.log('always selectedDate', selectedDate);

        if(isRepeatedDate(selectedDate)){
          console.log(`Is a repeteated day & date Selection: `, selectedDate);
          selectedDate.pop();
          selectedDate.pop();
          let isCheked = e.target.classList.contains('calendar__day-selected') 
                        ? e.target.classList.remove('calendar__day-selected')
                        : null;
        }
        console.log('Pass All comprobations & date Selection: ', selectedDate)
        /* check days and adding class selected */
        let isCheked = !e.target.classList.contains('calendar__day-selected') 
                      ? e.target.classList.add('calendar__day-selected')
                      : e.target.classList.remove('calendar__day-selected');
    }

    /* Change month in calendar */
    if(e.target.classList.contains('fa-chevron-left') || e.target.classList.contains('calendar-left-arrow')) {
        currentCalendarActive.classList.remove('calendar-active');
        currentCalendarActive.previousElementSibling.classList.add('calendar-active');
    }
    else if( e.target.classList.contains('fa-chevron-right') || e.target.classList.contains('calendar-right-arrow')) {
        currentCalendarActive.classList.remove('calendar-active');
        currentCalendarActive.nextElementSibling.classList.add('calendar-active');
    }
})

function getCalendarSelection(day){
    selectedDate = [...selectedDate, parseCalendar(day)];
    return selectedDate;
}

function isConsecutiveDate(parsedCalendar){
  if(parsedCalendar.length === 1 ) return true;
  let flag = false;
  if(parsedCalendar.length > 1){
    const day = parsedCalendar[parsedCalendar.length - 2];
    const nextDay = parsedCalendar[parsedCalendar.length - 1];
    // if(day.d.getTime() == nextDay.d.getTime() || day.addDays(1).getTime() == nextDay.d.getTime()){
    if( day.addDays(1).getTime() == nextDay.d.getTime()){
      flag = true;
    }
  }
  return flag;
}
function isRepeatedDate(parsedCalendar){
    let flag = false;
    if(parsedCalendar.length > 1){
      const dateStamps = parsedCalendar.map((element) => Number(element.dateStamp()));
      const isRepeated = dateStamps.some((val, i) => dateStamps.indexOf(val) !== i);
      if(isRepeated){
        flag = true;
      }
    }
    return flag;
}

function isAvailableDate(parsedDate){
    const today = new Date();
    if(parsedDate.date() > today){
      return true;
    }
    return false;
}

function parseCalendar(htmlCalendarDay){
    const enMonths = {'january':0,'february':1,'march':2,'april':3,'may':4,'june':5,'july':6,'august':7,'september':8,'october':9,'november':10, 'december':11};
    const esMonths = {'enero':0,'febrero':1,'marzo':2,'abril':3,'mayo':4,'junio':5,'julio':6,'agosto':7,'septiembre':8,'octubre':9,'noviembre':10, 'diciembre':11};

    const monthsTranslations = {
      en: enMonths,
      es: esMonths,
    }

    const calendarBase = htmlCalendarDay.parentElement.parentElement.parentElement;
    const calendar = function(){
        const year = Number(calendarBase.querySelector('.calendar__year'). textContent);
        const month = calendarBase.querySelector('.calendar__month').textContent
        const day = Number(htmlCalendarDay.textContent);
        return {
            year: year,
            month: month,
            day: day,
            d: new Date( year, monthsTranslations[locale][month.toLowerCase()], day),
            addDays: function(days){
                const newDate =  new Date( +this.d );
                newDate.setDate(newDate.getDate() + Number(days));
                return newDate;
            },
            dateISOFormat: function(){
                return new this.d.toISOString();
            },
            date: function(){
                return this.d;
            },
            dateStamp: function(){
                return [year,monthsTranslations[locale][month.toLowerCase()],day].join('');
            }
        };
    }
    
    return calendar();
}

/**
 *add a 0 to a one digit number 
 *to convert it to two digits
*/
function toValidDateNumber(number){
    return ('' + number).length < 2 ? '0' + ('' + number): ('' + number);
}