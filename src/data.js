import {
  getMixedArray,
  getRandomInteger
} from './utils.js';

const types = [`taxi`,
  `flight`,
  `drive`,
  `checkIn`,
  `transport`,
  `sightseeing`,
  `restaurant`
];

const destinations = [`Airport`,
  `Geneva`,
  `Chamonix`,
  `hotel`,
  `Gare Routière`,
  `Mausolée Brunswick`,
  `Scandale`
];

const prices = [10, 20, 40, 80];

const times = [
  {
    time: {
      start: `10.00`,
      end: `11.00`
    },
    duration: `1h 30m`
  },
  {
    time: {
      start: `12.00`,
      end: `15.30`
    },
    duration: `3h 30m`
  },
  {
    time: {
      start: `16.00`,
      end: `17.00`
    },
    duration: `1h`
  },
  {
    time: {
      start: `18.30`,
      end: `20.00`
    },
    duration: `1h 30m`,
  }
];

const Specials = [`Order UBER`,
  `Switch to comfort class`,
  `Add meal`,
  `Choose seats`,
  `Rent a car`,
  `Individual guide`];

let getDataCards = () => {
  let dataCards = [];
  for (let i = 1; i < 8; i++) {
    const dataCard = {
      id: i,
      type: types[getRandomInteger(0, types.length - 1)],
      destination: destinations[getRandomInteger(0, destinations.length - 1)],
      time: times[getRandomInteger(0, times.length - 1)],
      price: prices[getRandomInteger(0, prices.length - 1)],
      specials: getMixedArray(Specials).slice(0, getRandomInteger(0, 2))
        .map((name) => ({name, price: getRandomInteger(10, 100)}))
    };
    dataCards.push(dataCard);
  }
  return dataCards;
};

export const preparedData = getDataCards();
