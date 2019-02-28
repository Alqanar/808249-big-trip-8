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

const Specials = {
  uber: {
    name: `Order UBER`,
    price: 20
  },
  business: {
    name: `Switch to comfort class`,
    price: 20
  },
  meal: {
    name: `Add meal`,
    price: 20
  },
  seats: {
    name: `Choose seats`,
    price: 10
  },
  rentCar: {
    name: `Rent a car`,
    price: 200
  },
  individual: {
    name: `Individual guide`,
    price: 300
  }
};

const arraySpecials = Object.keys(Specials);

let getCardDatas = (params) => {
  let cardDatas = [];
  for (let i = 1; i < 8; i++) {
    const cardData = {
      id: i,
      type: params.types[getRandomInteger(0, params.types.length - 1)],
      destination: params.destinations[getRandomInteger(0, params.destinations.length - 1)],
      time: params.times[getRandomInteger(0, params.times.length - 1)],
      price: params.prices[getRandomInteger(0, params.prices.length - 1)],
      specials: getMixedArray(arraySpecials).slice(0, getRandomInteger(0, 2)).map((element) => {
        return {...Specials[element]};
      })
    };
    cardDatas.push(cardData);
  }
  return cardDatas;
};


// const prepareDataForTemplate = (data) => {
//   const {
//     id,
//     type,
//     destination,
//     time,
//     duration,
//     price = 0,
//   } = data;

//   return {
//     id,
//     type,
//     destination,
//     time,
//     duration,
//     price,
//     specials: getMixedArray(arraySpecials).slice(0, getRandomInteger(0, 2)).map((element) => {
//       return {...Specials[element]};
//     })
//   };
// };

export const preparedData = getCardDatas({types, destinations, times, prices, Specials});
