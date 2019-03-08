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

export const getDuration = ({startHour, startMinutes, endHour, endMinutes}) => {
  let hourDuration = endHour - startHour;
  let minutesDuration = endMinutes - startMinutes;
  if (minutesDuration < 0) {
    hourDuration = hourDuration - 1;
    minutesDuration = 60 + minutesDuration;
  }
  return `${hourDuration}h ${minutesDuration}m`;
};
