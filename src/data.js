import moment from 'moment';

import {
  getMixedArray,
  getRandomInteger,
  getDuration
} from './utils.js';
import {
  TYPES_MAP
} from './trip-types.js';

const types = Object.keys(TYPES_MAP);

const destinations = [`Airport`,
  `Geneva`,
  `Chamonix`,
  `hotel`,
  `Gare Routière`,
  `Mausolée Brunswick`,
  `Scandale`
];

const prices = [10, 20, 40, 80];

const NUMBER_CARDS = 7;

const getTime = () => {
  const dateStart = moment(`2019-03-18`);
  const dateEnd = moment(`2019-03-18`);
  dateStart.set(`hour`, getRandomInteger(0, 22));
  dateStart.set(`minute`, getRandomInteger(0, 59));
  dateEnd.set(`hour`, getRandomInteger(dateStart.get(`hour`) + 1, 23));
  dateEnd.set(`minute`, getRandomInteger(0, 59));
  return {
    dateStart: dateStart.toDate(),
    dateEnd: dateEnd.toDate()
  };
};

const Specials = [`Order UBER`,
  `Switch to comfort class`,
  `Add meal`,
  `Choose seats`,
  `Rent a car`,
  `Individual guide`];

const Text = [`Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis.`,
  `Aliquam erat volutpat.`,
  `Nunc fermentum tortor ac porta dapibus.`,
  `In rutrum ac purus sit amet tempus.`];

const getSrc = () => {
  let blockSrc = [];
  for (let i = 0; i < 8; i++) {
    blockSrc.push(`http://picsum.photos/300/150?r=${Math.random()}`);
  }
  return blockSrc;
};

let getDataCards = () => {
  let dataCards = [];
  for (let i = 1; i <= NUMBER_CARDS; i++) {
    const time = getTime();
    const dataCard = {
      id: i,
      type: types[getRandomInteger(0, types.length - 1)],
      destination: destinations[getRandomInteger(0, destinations.length - 1)],
      time,
      duration: getDuration(time),
      price: prices[getRandomInteger(0, prices.length - 1)],
      specials: getMixedArray(Specials).slice(0, getRandomInteger(0, 3))
        .map((name) => ({name, price: getRandomInteger(10, 100)})),
      text: getMixedArray(Text).slice(0, getRandomInteger(1, 3)),
      src: getSrc().slice(0, getRandomInteger(2, 8))
    };
    dataCards.push(dataCard);
  }
  return dataCards;
};

export const preparedData = getDataCards();
