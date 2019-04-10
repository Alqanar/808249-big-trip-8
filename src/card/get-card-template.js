import moment from 'moment';

import {
  TYPES_MAP
} from '../types-map.js';
import {
  countSpecialPrice,
  addZero
} from '../utils.js';


const createOffers = (specialsArray) => {
  let specials = ``;
  const checkedSpecials = specialsArray.filter((element) => {
    return element.accepted;
  });
  checkedSpecials.forEach((special) => {
    specials +=
      `<li>
        <button class="trip-point__offer">${special.name} +&euro;&nbsp;${special.price}</button>
      </li>`;
  });
  return specials;
};

const renderOffersTemplate = (specials) =>
  `<ul class="trip-point__offers">
    ${createOffers(specials)}
  </ul>`;

const showDuration = (duration) => {
  if (!(duration.days || duration.hours)) {
    return `${addZero(duration.minutes)}M`;
  } else if (!duration.days) {
    return `${addZero(duration.hours)}H ${addZero(duration.minutes)}M`;
  }
  return `${addZero(duration.days)}D ${addZero(duration.hours)}H ${addZero(duration.minutes)}M`;
};


export const getCardTemplate = (data) =>
  `<article class="trip-point">
    <i class="trip-icon">${TYPES_MAP[data.type].icon}</i>
    <h3 class="trip-point__title">${TYPES_MAP[data.type].title} ${data.destination}</h3>
    <p class="trip-point__schedule">
      <span class="trip-point__timetable">${moment(data.time.dateStart).format(`HH:mm`)} — ${moment(data.time.dateEnd).format(`HH:mm`)}</span>
      <span class="trip-point__duration">${showDuration(data.duration)}</span>
    </p>
    <p class="trip-point__price">&euro;&nbsp;${data.price + countSpecialPrice(data.specials)}</p>
    ${renderOffersTemplate(data.specials)}
  </article>`;
