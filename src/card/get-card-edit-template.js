import moment from 'moment';

import {
  TYPES_MAP
} from '../types-map.js';
import {
  countSpecialPrice
} from '../utils.js';


const createWays = (currentType, data) => {
  return Object.keys(data).reduce((result, key) => {
    result[data[key].type] = result[data[key].type] || ``;
    result[data[key].type] +=
      `<input class="travel-way__select-input visually-hidden" 
        type="radio" 
        id="travel-way-${key}" 
        name="travel-way" 
        value="${key}"
        ${currentType === key ? `checked` : ``}>
      <label class="travel-way__select-label" for="travel-way-${key}">${data[key].icon} ${key}</label>`;
    return result;
  }, {});
};

const renderWays = (type, data) => {
  const ways = createWays(type, data);
  return `
    <div class="travel-way__select">
      ${Object.values(ways).map((way) => `<div class="travel-way__select-group">${way}</div>`).join(``)}
    </div>`;
};

const renderCheckedWay = (type, dataType) =>
  `<div class="travel-way">
    <label class="travel-way__label" for="travel-way__toggle">${dataType[type].icon}</label>
    <input type="checkbox" class="travel-way__toggle visually-hidden" id="travel-way__toggle">
    ${renderWays(type, dataType)}
  </div>`;

const createDestination = (destinations) => {
  let destinationForSelect = ``;
  destinations.forEach(({name}) => {
    destinationForSelect += `<option value="${name}"></option>`;
  });
  return destinationForSelect;
};

const renderDestination = (destinations, title, destination) =>
  `<div class="point__destination-wrap">
    <label class="point__destination-label" for="destination">${title}</label>
    <input class="point__destination-input" list="destination-select" id="destination" value="${destination}" name="destination" required>
    <datalist id="destination-select">
      ${createDestination(destinations)}
    </datalist>
  </div>`;

const renderTime = (time) =>
  `<div class="point__time">
    choose time
    <input class="point__input" type="text" value="${moment(time.dateStart).format(`HH:mm`)}" name="date-start" placeholder="00:00" required>
    <input class="point__input" type="text" value="${moment(time.dateEnd).format(`HH:mm`)}" name="date-end" placeholder="00:00" required>
  </div>`;

const renderPrice = (price, specialsArray) =>
  `<label class="point__price">
    write price
    <span class="point__price-currency">€</span>
    <input class="point__input" type="text" value="${price + countSpecialPrice(specialsArray)}" name="price" required>
  </label>`;

const renderButtons = () =>
  `<div class="point__buttons">
    <button class="point__button point__button--save" type="submit">Save</button>
    <button class="point__button" type="reset">Delete</button>
  </div>`;

const renderFavorite = (favorite, id) =>
  `<div class="paint__favorite-wrap">
    <input type="checkbox" class="point__favorite-input visually-hidden" id="favorite_${id}" name="favorite" ${favorite ? `checked` : ``}>
    <label class="point__favorite" for="favorite_${id}">favorite</label>
  </div>`;

const changeOfferId = (name) =>
  name.replace(/ /g, `_`);

const createOffers = (specialsArray, id) => {
  let specials = ``;
  specialsArray.forEach((special) => {
    specials +=
      `<input class="point__offers-input visually-hidden" type="checkbox" id="${changeOfferId(special.name)}_${id}" name="offer" value="${special.name}" ${special.accepted ? `checked` : ``}>
      <label for="${changeOfferId(special.name)}_${id}" class="point__offers-label">
        <span class="point__offer-service">${special.name}</span> + €<span class="point__offer-price">${special.price}</span>
      </label>`;
  });
  return specials;
};

const renderOffers = (specials, id) =>
  `<section class="point__offers">
    <h3 class="point__details-title">offers</h3>
    <div class="point__offers-wrap">
      ${createOffers(specials, id)}
    </div>
  </section>`;

const createLinks = (links) => {
  let blockLinks = ``;
  links.forEach((link) => {
    blockLinks += `<img src="${link.src}" alt="${link.value}" class="point__destination-image">`;
  });
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

export const getCardEditTemplate = (data, destinations) =>
  `<article class="point">
    <form action="" method="get">
      <header class="point__header">
        <label class="point__date">
          choose day
          <input class="point__input" type="text" placeholder="MAR 18" name="day">
        </label>
        ${renderCheckedWay(data.type, TYPES_MAP)}
        ${renderDestination(destinations, TYPES_MAP[data.type].title, data.destination)}
        ${renderTime(data.time)}
        ${renderPrice(data.price, data.specials)}
        ${renderButtons()}
        ${renderFavorite(data.favorite, data.id)}
      </header>
      <section class="point__details">
        ${renderOffers(data.specials, data.id)}
        ${renderPointDestination(data.text, data.pictures)}
        <input type="hidden" class="point__total-price" name="total-price" value="">
      </section>
    </form>
  </article>`;
