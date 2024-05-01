// Opisany w dokumentacji
import flatpickr from 'flatpickr';
// Dodatkowy import stylów
import 'flatpickr/dist/flatpickr.min.css';
// all modules
import Notiflix from 'notiflix';

const inputData = document.querySelector('#datetime-picker');
const fromDays = document.querySelector('[data-days]');
const fromHours = document.querySelector('[data-hours]');
const fromMinutes = document.querySelector('[data-minutes]');
const fromSeconds = document.querySelector('[data-seconds]');
const btnStartWraper = document.querySelector('[data-start]');

let time = null;
let timerId = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    //console.log(selectedDates[0]);
    time = selectedDates[0] - new Date();
    if (time > 0) {
      btnStartWraper.removeAttribute('disabled');
      upDateTimerView(convertMs(time));
    } else {
      btnStartWraper.setAttribute('disabled', '');
      Notiflix.Notify.failure('Please choose a date in the future');
    }
  },
};

function updateTimer() {
  if (time > 1000) {
    time -= 1000;
    upDateTimerView(convertMs(time));
  } else {
    clearInterval(timerId);
    Notiflix.Notify.success('Time ends');
  }
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
//console.log(convertMs(2000));// {days: 0, hours: 0, minutes: 0, seconds: 2}
//console.log(convertMs(140000));// {days: 0, hours: 0, minutes: 2, seconds: 20}
//console.log(convertMs(24140000));// {days: 0, hours: 6 minutes: 42, seconds: 20}

function addLeadingZero(value) {
  return value.toString().padStart(2, '0');
}

function upDateTimerView(time) {
  fromDays.textContent = addLeadingZero(time.days);
  fromHours.textContent = addLeadingZero(time.hours);
  fromMinutes.textContent = addLeadingZero(time.minutes);
  fromSeconds.textContent = addLeadingZero(time.seconds);
}

function startTimer() {
  timerId = setInterval(updateTimer, 1000);
  btnStartWraper.setAttribute('disabled', '');
  inputData.setAttribute('disabled', '');
  Notiflix.Notify.info('Time starts');
}

btnStartWraper.addEventListener('click', startTimer);
btnStartWraper.setAttribute('disabled', '');
flatpickr('#datetime-picker', options);
