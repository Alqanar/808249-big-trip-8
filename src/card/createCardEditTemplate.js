import moment from 'moment';

import {
  TYPES_MAP
} from '../trip-types.js';

const Destinations = [`Airport`,
  `Geneva`,
  `Chamonix`,
  `hotel`,
  `Gare Routière`,
  `Mausolée Brunswick`,
  `Scandale`
];

const createWays = (type, data) => {
  let moves = ``;
  let places = ``;
  for (let key in data) {
    if (data.hasOwnProperty(key)) {
      const way =
      `<input class="travel-way__select-input visually-hidden" 
        type="radio" 
        id="travel-way-${key}" 
        name="travel-way" 
        value="${key}"
        ${type === key ? `checked` : ``}>
      <label class="travel-way__select-label" for="travel-way-${key}">${data[key].icon} ${key}</label>`;
      if (data[key].type === `move`) {
        moves += way;
      } else {
        places += way;
      }
    }
  }
  return {moves, places};
};

const renderWays = (type, data) => {
  const ways = createWays(type, data);
  return `
    <div class="travel-way__select">
      <div class="travel-way__select-group">
        ${ways.moves}
      </div>
      <div class="travel-way__select-group">
        ${ways.places}
      </div>
    </div>`;
};

const renderCheckedWay = (type, dataType) =>
  `<div class="travel-way">
    <label class="travel-way__label" for="travel-way__toggle">${dataType[type].icon}</label>
    <input type="checkbox" class="travel-way__toggle visually-hidden" id="travel-way__toggle">
    ${renderWays(type, dataType)}
  </div>`;

const createDestinaion = (destinations) => {
  let destinationForSelect = ``;
  for (let destination of destinations) {
    destinationForSelect += `<option value="${destination}"></option>`;
  }
  return destinationForSelect;
};

const renderDestination = (destinations, title, destination) =>
  `<div class="point__destination-wrap">
    <label class="point__destination-label" for="destination">${title}</label>
    <input class="point__destination-input" list="destination-select" id="destination" value="${destination}" name="destination">
    <datalist id="destination-select">
      ${createDestinaion(destinations)}
    </datalist>
  </div>`;

const renderTime = (time) =>
  `<div class="point__time">
    choose time
    <input class="point__input" type="text" value="${moment(time.dateStart).format(`HH:mm`)}" name="date-start" placeholder="00:00">
    <input class="point__input" type="text" value="${moment(time.dateEnd).format(`HH:mm`)}" name="date-end" placeholder="00:00">
  </div>`;

const renderPrice = (price) =>
  `<label class="point__price">
    write price
    <span class="point__price-currency">€</span>
    <input class="point__input" type="text" value="${price}" name="price">
  </label>`;

const renderButtons = () =>
  `<div class="point__buttons">
    <button class="point__button point__button--save" type="submit">Save</button>
    <button class="point__button" type="reset">Delete</button>
  </div>`;

const renderFavorite = () =>
  `<div class="paint__favorite-wrap">
    <input type="checkbox" class="point__favorite-input visually-hidden" id="favorite" name="favorite">
    <label class="point__favorite" for="favorite">favorite</label>
  </div>`;

const createOffers = (specialsArray) => {
  let specials = ``;
  for (let special of specialsArray) {
    specials +=
      `<input class="point__offers-input visually-hidden" type="checkbox" id="${special.name}" name="offer" value="${special.name}" ${special.accepted ? `checked` : ``}>
      <label for="${special.name}" class="point__offers-label">
        <span class="point__offer-service">${special.name}</span> + €<span class="point__offer-price">${special.price}</span>
      </label>`;
  }
  return specials;
};

const renderOffers = (specials) =>
  `<section class="point__offers">
    <h3 class="point__details-title">offers</h3>
    <div class="point__offers-wrap">
      ${createOffers(specials)}
    </div>
  </section>`;

// const createDescription = (texts) => {
//   let blockTexts = ``;
//   for (let line of texts) {
//     blockTexts += line + ` `;
//   }
//   return blockTexts;
// };

const createLinks = (links) => {
  let blockLinks = ``;
  for (let link of links) {
    blockLinks += `<img src="${link.src}" alt="${link.value}" class="point__destination-image">`;
  }
  return blockLinks;
};

const renderPointDestination = (texts, links) =>
  `<section class="point__destination">
    <h3 class="point__details-title">Destination</h3>
    <p class="point__destination-text">${texts}</p>
    <div class="point__destination-images">
      ${createLinks(links)}
    </div>
  </section>`;
// <p class="point__destination-text">${createDescription(texts)}</p>

export const getTemplate = (data) =>
  `<article class="point">
    <form action="" method="get">
      <header class="point__header">
        <label class="point__date">
          choose day
          <input class="point__input" type="text" placeholder="MAR 18" name="day">
        </label>
        ${renderCheckedWay(data.type, TYPES_MAP)}
        ${renderDestination(Destinations, TYPES_MAP[data.type].title, data.destination)}
        ${renderTime(data.time)}
        ${renderPrice(data.price)}
        ${renderButtons()}
        ${renderFavorite()}
      </header>
      <section class="point__details">
        ${renderOffers(data.specials)}
        ${renderPointDestination(data.text, data.pictures)}
        <input type="hidden" class="point__total-price" name="total-price" value="">
      </section>
    </form>
  </article>`;
