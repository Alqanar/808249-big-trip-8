import moment from 'moment';


export const createElement = (html) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = html;
  return newElement.firstChild;
};

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

export const transformDataToCard = (objectData) => {
  const time = {};
  time.dateStart = new Date(objectData.date_from);
  time.dateEnd = new Date(objectData.date_to);
  return {
    'id': parseInt(objectData.id, 10),
    'type': objectData.type,
    'destination': objectData.destination.name,
    'time': time,
    'duration': getDuration(time),
    'price': objectData.base_price,
    'specials': objectData.offers.map(({accepted, price, title}) => ({accepted, price, name: title})),
    'text': objectData.destination.description,
    'pictures': objectData.destination.pictures.map(({src, description}) => ({src, value: description})),
    'favorite': objectData.is_favorite
  };
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

export const block = (inputs, buttons) => {
  changeStatusDisabled(inputs, true);
  changeStatusDisabled(buttons, true);
};

export const unblock = (inputs, buttons) => {
  changeStatusDisabled(inputs, false);
  changeStatusDisabled(buttons, false);
};
