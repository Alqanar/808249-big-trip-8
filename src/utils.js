import moment from 'moment';


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

export const getDuration = ({dateStart, dateEnd}) => {
  dateStart = moment(dateStart);
  dateEnd = moment(dateEnd);
  const duration = moment.duration(dateEnd.diff(dateStart));
  const hours = duration.hours();
  const minutes = duration.minutes();
  return {
    hours,
    minutes
  };
};
