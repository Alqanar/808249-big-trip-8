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

// const addZero = (number) =>
//   String(number).padStart(2, `0`);

// export const parseTimeToString = ({startHour, startMinutes, endHour, endMinutes}) =>
//   `${addZero(startHour)}:${addZero(startMinutes)} — ${addZero(endHour)}:${addZero(endMinutes)}`;

export const getDuration = ({dateStart, dateEnd}) => {
  const duration = moment.duration(dateEnd.diff(dateStart));
  const hours = duration.hours();
  const minutes = duration.minutes();
  return {
    hours,
    minutes
  };
};

const addZeroStart = (string) =>
  string.padStart(2, `0`);

const addZeroEnd = (string) =>
  string.padEnd(2, `0`);

const addZeroOnSeparate = (string) => {
  let newString = ``;
  let arrayString = string.split(`:`);
  arrayString[0] = addZeroStart(arrayString[0]);
  arrayString[1] = addZeroEnd(arrayString[1]);
  newString = `${arrayString[0]}:${arrayString[1]}`;
  return newString;
};

export const changeSeparator = (string) => {
  let newString = ``;
  let updateString = string;
  if (/\./.test(string)) {
    updateString = string.replace(/\./, `:`);
    return updateString;
  }
  if (/:/.test(string)) {
    updateString = addZeroOnSeparate(string);
    return updateString;
  }

  const nameStringSymbol = updateString[2];

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
    newString = updateString.replace(nameStringSymbol, `:`);
  }
  if (conditionTwo) {
    const firstPartString = updateString.slice(0, 2);
    const restPartString = updateString.slice(2);
    newString = newString.concat(firstPartString, `:`, restPartString);
  }
  if (conditionThree) {
    const firstPartString = updateString.slice(0);
    const lostPart = `:`;
    newString = newString.concat(firstPartString, lostPart);
  }
  if (!conditionOne && !conditionTwo && !conditionThree) {
    newString = updateString;
  }

  return newString;
};

const fixTimeElement = (elementArray) => {
  if (typeof (parseInt(elementArray, 10)) !== `number` || isNaN(parseInt(elementArray, 10))) {
    return `00`;
  }
  return elementArray;
};

export const fixTime = (array) => {
  let updatearray = array.map(fixTimeElement);
  updatearray[0] = addZeroStart(updatearray[0]);
  updatearray[1] = addZeroEnd(updatearray[1]);
  return updatearray;
}

const generateError = (min, max) =>
  `Invalid value entered! Enter a value in the format from ${min} to ${max}`;

export const validateTime = (string, time) => {
  const startTime = string.split(` `)[0];
  const endTime = string.split(` `)[2];
  const value = string.trim();
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
  } else if (/\d\d:\d\d\s*—\s*\d\d:\d\d/.test(value)) {
    error = `Invalid value entered! Enter a value in the format 'HH:MM — HH:MM'`;
  }

  return error;
};
