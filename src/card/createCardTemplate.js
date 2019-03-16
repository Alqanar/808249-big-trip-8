import {
  TYPES_MAP
} from '../trip-types.js';


const createOffers = (specialsArray) => {
  let specials = ``;
  for (let special of specialsArray) {
    specials +=
      `<li>
        <button class="trip-point__offer">${special.name} +&euro;&nbsp;${special.price}</button>
      </li>`;
  }
  return specials;
};

const renderOffersTemplate = (specials) =>
  `<ul class="trip-point__offers">
    ${createOffers(specials)}
  </ul>`;


export const getTemplate = (data) =>
  `<article class="trip-point">
    <i class="trip-icon">${TYPES_MAP[data.type].icon}</i>
    <h3 class="trip-point__title">${TYPES_MAP[data.type].title} ${data.destination}</h3>
    <p class="trip-point__schedule">
      <span class="trip-point__timetable">${data.time.dateStart.format(`HH:mm`)} — ${data.time.dateEnd.format(`HH:mm`)}</span>
      <span class="trip-point__duration">${data.duration.hours}h ${data.duration.minutes}m</span>
    </p>
    <p class="trip-point__price">&euro;&nbsp;${data.price}</p>
    ${renderOffersTemplate(data.specials)}
  </article>`;
