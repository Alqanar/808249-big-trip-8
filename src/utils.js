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

export const transformData = (objectData) => {
  let newData = {};
  newData.id = parseInt(objectData.id, 10);
  newData.type = objectData.type;
  newData.destination = objectData.destination.name;
  newData.time = {};
  newData.time.dateStart = new Date(objectData.date_from);
  newData.time.dateEnd = new Date(objectData.date_to);
  newData.duration = getDuration(newData.time);
  newData.price = objectData.base_price;
  newData.specials = objectData.offers.map(({accepted, price, title}) => ({accepted, price, name: title}));
  newData.text = objectData.destination.description;
  newData.pictures = objectData.destination.pictures.map(({src, description}) => ({src, value: description}));

  return newData;
};
