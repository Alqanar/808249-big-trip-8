import {
  createElement
} from '../utils.js';
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

export default class Card {
  constructor(data) {
    this._id = data.id;
    this._type = data.type;
    this._destination = data.destination;
    this._time = data.time;
    this._duration = data.duration;
    this._price = data.price;
    this._specials = data.specials;

    this._state = {
      isEdit: false
    };
  }

  get template() {
    return `<article class="trip-point">
    <i class="trip-icon">${TYPES_MAP[this._type].icon}</i>
    <h3 class="trip-point__title">${TYPES_MAP[this._type].title} ${this._destination}</h3>
    <p class="trip-point__schedule">
      <span class="trip-point__timetable">${this._time}</span>
      <span class="trip-point__duration">${this._duration}</span>
    </p>
    <p class="trip-point__price">&euro;&nbsp;${this._price}</p>
    ${renderOffersTemplate(this._specials)}
  </article>`;
  }

  render(container) {
    if (this._element) {
      container.removeChild(this._element);
      this._element = null;
    }

    this._element = createElement(this.template);
    container.appendChild(this._element);
  }
}
