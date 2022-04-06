"use strict";
const Month = UCalendar.getMonthCalendarInfo(2022, 2);

const MyCalendar = new UICalendar(Month);

const MyYearCalendar = new UIFullCalendar({Year: 2022, target: document.querySelector('#reservationCalendar')});