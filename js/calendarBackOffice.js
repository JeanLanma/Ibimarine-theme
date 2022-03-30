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
const locale = 'es';

/**
 * Year & Array with 12 empty slots to save the months with their translations.
 * months constant will help store the translated months 
 * with the native Intl js object below
*/

const actualYear = 2022;
const months = [...Array(12).keys()];


/* Settings to Format JS dates with Localization settings above */
const intlForMonths = new Intl.DateTimeFormat(locale, { month: 'long' })
const intlForWeeks = new Intl.DateTimeFormat(locale, { weekday: 'narrow' })

/**
 * WeekDyas Auto-Translated with Native JS Date Object
 * Formatted with Intl object to help with localization 
*/
const weekDays = [...Array(7).keys()].map((dayIndex) =>
  intlForWeeks.format(new Date(actualYear, 7, dayIndex + 1))
)

/**
 * Get Calendar info to fill HTML calendar with accurate data
*/
const calendar = months.map((monthIndex) => {
  const monthName = intlForMonths.format(new Date(actualYear, monthIndex));
  const nextMonthIndex = (monthIndex + 1) % 12;
  const daysOfMonth = new Date(actualYear, nextMonthIndex, 0).getDate();
  const startsOn = new Date(actualYear, monthIndex, 1).getDay();
  return {
    daysOfMonth,
    monthName,
    startsOn: (startsOn === 0 ? 7 : startsOn),
    monthId: new Date().getFullYear() + monthIndex.toString() ,
  }
})

  /**
   * Make The html with accurete and localized information.
  */
const CalendarTohtml = calendar.map(({ daysOfMonth, monthName, startsOn,monthId }) => {
    const days = [...Array(daysOfMonth).keys()];

    const firstDayAttributes = `class='first-day month-day' style='--first-day-start: ${startsOn}'`;
    
    const htmlDaysName = weekDays
                        .map((dayName) => `<li class='day-name'>${dayName}</li>`)
                        .join('');

    const htmlDays = days
                      .map((day, index) =>
                          `<li ${index === 0 ? firstDayAttributes : 'class="month-day"'}>${day + 1}</li>`
                      )
                      .join('')

    const currentDate = new Date();
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
document.querySelector('#reservationCalendar').innerHTML = CalendarTohtml.join('');

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

        /**
         * Add a validated date
         */
        getCalendarSelection(day);
        console.log('always selectedDate', selectedDate)

        if(isRepeatedDate(selectedDate)){
          console.log(`Is a repeteated day & date Selection: `, selectedDate);
          selectedDate.pop();
          selectedDate.pop();
          let isCheked = e.target.classList.contains('calendar__day-selected') 
                        ? e.target.classList.remove('calendar__day-selected')
                        : null;
          return null;
        }
        /* If not select next day consecutively, restart selection from last selected day*/
        if(selectedDate.length > 1 && !isConsecutiveDate(selectedDate[selectedDate.length -2],selectedDate[selectedDate.length - 1].date())){
            selectedDate = [];
            for(let i = 0; i < daysWithActiveClass.length; i++){
              daysWithActiveClass[i].classList.remove('calendar__day-selected');
            }
            getCalendarSelection(day);
            e.target.classList.add('calendar__day-selected')
            console.log('Is not consecutive & date Selection: ', selectedDate)
            return null;
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

function isConsecutiveDate(day, nextDay){
  let flag = false;
  if(day.d.getTime() == nextDay.getTime() || day.addDays(1).getTime() == nextDay.getTime()){
    flag = true;
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