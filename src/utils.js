import moment from 'moment';

const MAX_HOURS = `24`;
const MAX_HOURS_START = `23`;
const MIN_HOURS = `00`;
const MAX_MINUTES = `59`;
const MIN_MINUTES = `00`;
const FORMAT_TIME = `HH:MM`;

export const createElement = (html) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = html;
  return newElement.firstChild;
};

export const getRandomInteger = (min, max) =>
  min + Math.floor(Math.random() * (max + 1 - min));

const getRandomComparator = () =>
  Math.random() - 0.5;

export const getMixedArray = (list) =>
  list.slice(0).sort(getRandomComparator);

const addZero = (number) =>
  String(number).padStart(2, `0`);

export const parseTimeToString = ({startHour, startMinutes, endHour, endMinutes}) =>
  `${addZero(startHour)}:${addZero(startMinutes)} — ${addZero(endHour)}:${addZero(endMinutes)}`;

export const getDuration = ({dateStart, dateEnd}) => {
  const duration = moment.duration(dateEnd.diff(dateStart));
  const hours = duration.hours();
  const minutes = duration.minutes();
  return {
    hours,
    minutes
  };
};

export const changeSeparator = (string, numberStringSymbol, nameStringSymbol) => {
  let newString = ``;
  const conditionOne =
    nameStringSymbol !== `:` &&
    nameStringSymbol !== undefined &&
    (isNaN(parseInt(nameStringSymbol, 10)) || typeof (parseInt(nameStringSymbol, 10)) !== `number`);
  const conditionTwo =
    nameStringSymbol !== `:` &&
    !isNaN(parseInt(nameStringSymbol, 10)) &&
    typeof (parseInt(nameStringSymbol, 10)) === `number`;
  const conditionThree = nameStringSymbol === undefined;
  if (conditionOne) {
    newString = string.replace(nameStringSymbol, `:`);
  }
  if (conditionTwo) {
    const firstPartString = string.slice(0, numberStringSymbol);
    const restPartString = string.slice(numberStringSymbol);
    newString = newString.concat(firstPartString, `:`, restPartString);
  }
  if (conditionThree) {
    const firstPartString = string.slice(0);
    const lostPart = `:`;
    newString = newString.concat(firstPartString, lostPart);
  }
  if (!conditionOne && !conditionTwo && !conditionThree) {
    newString = string;
  }
  return newString;
};

const generateError = (min, max) =>
  `Invalid value entered! Enter a value in the format from ${min} to ${max}`;

export const validateTime = (string, time) => {
  const startTime = string.split(` `)[0];
  const endTime = string.split(` `)[2];
  let error = ``;

  if (startTime.length !== 5 || endTime.length !== 5) {
    error = `Invalid value entered! Enter a value in the format ${FORMAT_TIME}`;
  } else if (time.startHour > parseInt(MAX_HOURS_START, 10) || time.startHour < parseInt(MIN_HOURS, 10)) {
    error = generateError(MIN_HOURS, MAX_HOURS_START);
  } else if (time.startMinutes > parseInt(MAX_MINUTES, 10) || time.startMinutes < parseInt(MIN_MINUTES, 10) ||
    time.endMinutes > parseInt(MAX_MINUTES, 10) || time.endMinutes < parseInt(MIN_MINUTES, 10)) {
    error = generateError(MAX_MINUTES, MIN_MINUTES);
  } else if (parseInt(time.endHour, 10) < parseInt(time.startHour, 10)) {
    error = `Invalid value entered! The end time of the event must be later than its start!`;
  } else if (time.endHour > parseInt(MAX_HOURS, 10) || time.endHour < parseInt(MIN_HOURS, 10)) {
    error = generateError(MIN_HOURS, MAX_HOURS);
  }

  return error;
};
