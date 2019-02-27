import {
  getMixedArray,
  getRandomInteger
} from './utils.js';

const cardsData = [
  {
    id: 1,
    type: `taxi`,
    destination: `Airport`,
    time: {
      start: `10.00`,
      end: `11.00`
    },
    duration: `1h 30m`,
    price: 20,
  },
  {
    id: 2,
    type: `flight`,
    destination: `Geneva`,
    time: {
      start: `10.00`,
      end: `11.00`
    },
    duration: `1h 30m`,
    price: 20,
  },
  {
    id: 3,
    type: `drive`,
    destination: `Chamonix`,
    time: {
      start: `10.00`,
      end: `11.00`
    },
    duration: `1h 30m`,
    price: 20,
  },
  {
    id: 4,
    type: `checkIn`,
    destination: `hotel`,
    time: {
      start: `10.00`,
      end: `11.00`
    },
    duration: `1h 30m`,
    price: 20,
  },
  {
    id: 5,
    type: `transport`,
    destination: `Gare Routière`,
    time: {
      start: `12.00`,
      end: `15.30`
    },
    duration: `3h 30m`,
    price: 10
  },
  {
    id: 6,
    type: `sightseeing`,
    destination: `Mausolée Brunswick`,
    time: {
      start: `16.00`,
      end: `17.00`
    },
    duration: `1h`,
  },
  {
    id: 7,
    type: `restaurant`,
    destination: `Scandale`,
    time: {
      start: `18.30`,
      end: `20.00`
    },
    duration: `1h 30m`,
    price: 80,
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

const prepareDataForTemplate = (data) => {
  const {
    id,
    type,
    destination,
    time,
    duration,
    price = 0,
  } = data;

  return {
    id,
    type,
    destination,
    time,
    duration,
    price,
    specials: getMixedArray(arraySpecials).slice(0, getRandomInteger(0, 2)).map((element) => {
      return {...Specials[element]};
    })
  };
};

export const preparedData = cardsData.map((element) => prepareDataForTemplate(element));
