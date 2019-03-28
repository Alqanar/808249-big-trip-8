import moment from 'moment';


export const createElement = (html) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = html;
  return newElement.firstChild;
};

// export const getRandomInteger = (min, max) =>
//   min + Math.floor(Math.random() * (max + 1 - min));

// const getRandomComparator = () =>
//   Math.random() - 0.5;

// export const getMixedArray = (list) =>
//   list.slice(0).sort(getRandomComparator);

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
  newData.favorite = objectData.is_favorite;

  return newData;
};

export const transformDataToServer = (objectUserData) => {
  return {
    'base_price': objectUserData.price,
    'date_from': objectUserData.time.dateStart.getTime(),
    'date_to': objectUserData.time.dateEnd.getTime(),
    'destination': {
      'description': objectUserData.text,
      'name': objectUserData.destination,
      'pictures': objectUserData.pictures.map(({src, value}) => ({src, description: value}))
    },
    'id': objectUserData.id + ``,
    'is_favorite': objectUserData.favorite,
    'offers': objectUserData.specials.map(({name, price, accepted}) => ({title: name, price, accepted})),
    'type': objectUserData.type
  };
};

const changeStatusDisabled = (collection, status) => {
  for (let element of collection) {
    element.disabled = status;
  }
};

export const getObjectElements = (classInstance) => {
  const inputs = classInstance.element.querySelectorAll(`form input`);
  const buttons = classInstance.element.querySelectorAll(`form button`);
  return {
    inputs,
    buttons
  };
};

export const block = ({inputs, buttons, button, text}) => {
  changeStatusDisabled(inputs, true);
  changeStatusDisabled(buttons, true);
  button.innerHTML = text;
};

export const unblock = ({inputs, buttons, button, text}) => {
  changeStatusDisabled(inputs, false);
  changeStatusDisabled(buttons, false);
  button.innerHTML = text;
};
