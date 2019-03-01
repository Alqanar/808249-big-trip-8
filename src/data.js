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

const getMinutes = () =>
  getRandomInteger(0, 59) > 30 ? 30 : 0;

const getTime = () => {
  const startHour = getRandomInteger(0, 23);
  const endHour = getRandomInteger(startHour + 1, 24);
  return {
    startHour,
    startMinutes: getMinutes(),
    endHour,
    endMinutes: getMinutes()
  };
};

const addZero = (number) =>
  String(number).padStart(2, `0`);

const parseTimeToString = ({startHour, startMinutes, endHour, endMinutes}) =>
  `${addZero(startHour)}:${addZero(startMinutes)}&nbsp;&mdash; ${addZero(endHour)}:${addZero(endMinutes)}`;

const getDuration = ({startHour, startMinutes, endHour, endMinutes}) => {
  let hourDuration = endHour - startHour;
  let minutesDuration = endMinutes - startMinutes;
  if (minutesDuration < 0) {
    hourDuration = hourDuration - 1;
    minutesDuration = 60 + minutesDuration;
  }
  return `${hourDuration}h ${minutesDuration}m`;
};

const Specials = [`Order UBER`,
  `Switch to comfort class`,
  `Add meal`,
  `Choose seats`,
  `Rent a car`,
  `Individual guide`];

let getDataCards = () => {
  let dataCards = [];
  for (let i = 1; i < 8; i++) {
    const time = getTime();
    const dataCard = {
      id: i,
      type: types[getRandomInteger(0, types.length - 1)],
      destination: destinations[getRandomInteger(0, destinations.length - 1)],
      time: parseTimeToString(time),
      duration: getDuration(time),
      price: prices[getRandomInteger(0, prices.length - 1)],
      specials: getMixedArray(Specials).slice(0, getRandomInteger(0, 2))
        .map((name) => ({name, price: getRandomInteger(10, 100)}))
    };
    dataCards.push(dataCard);
  }
  return dataCards;
};

export const preparedData = getDataCards();
