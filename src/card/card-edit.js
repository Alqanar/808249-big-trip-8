import {
  createElement,
  getDuration
} from '../utils.js';
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

const MAX_HOURS = `24`;
const MAX_HOURS_START = `23`;
const MIN_HOURS = `00`;
const MAX_MINUTES = `59`;
const MIN_MINUTES = `00`;
const FORMAT_TIME = `HH:MM`;

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
  `<label class="point__time">
    choose time
    <input class="point__input" type="text" value="${time}" name="time" placeholder="00:00 — 00:00">
  </label>`;

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
      `<input class="point__offers-input visually-hidden" type="checkbox" id="${special.name}" name="offer" value="${special.name}">
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

const createDescription = (texts) => {
  let blockTexts = ``;
  for (let line of texts) {
    blockTexts += line + ` `;
  }
  return blockTexts;
};

const createLinks = (links) => {
  let blockLinks = ``;
  for (let link of links) {
    blockLinks += `<img src="${link}" alt="picture from place" class="point__destination-image">`;
  }
  return blockLinks;
};

const renderPointDestination = (texts, links) =>
  `<section class="point__destination">
    <h3 class="point__details-title">Destination</h3>
    <p class="point__destination-text">${createDescription(texts)}</p>
    <div class="point__destination-images">
      ${createLinks(links)}
    </div>
  </section>`;

export default class CardEdit {
  constructor(data) {
    this._id = data.id;
    this._type = data.type;
    this._destination = data.destination;
    this._time = data.time;
    this._duration = data.duration;
    this._price = data.price;
    this._specials = data.specials;
    this._text = data.text;
    this._src = data.src;

    this._element = null;
    this._submitHandler = null;
    this._onSubmit = this._onSubmit.bind(this);
    this._onSelectWay = this._onSelectWay.bind(this);
    this._onChangeTime = this._onChangeTime.bind(this);

    this._timeObject = {
      startHour: null,
      startMinutes: null,
      endHour: null,
      endMinutes: null
    };
  }

  get template() {
    return `<article class="point">
      <form action="" method="get">
        <header class="point__header">
          <label class="point__date">
            choose day
            <input class="point__input" type="text" placeholder="MAR 18" name="day">
          </label>
          ${renderCheckedWay(this._type, TYPES_MAP)}
          ${renderDestination(Destinations, TYPES_MAP[this._type].title, this._destination)}
          ${renderTime(this._time)}
          ${renderPrice(this._price)}
          ${renderButtons()}
          ${renderFavorite()}
        </header>
        <section class="point__details">
          ${renderOffers(this._specials)}
          ${renderPointDestination(this._text, this._src)}
          <input type="hidden" class="point__total-price" name="total-price" value="">
        </section>
      </form>
    </article>`;
  }

  get element() {
    return this._element;
  }

  bind() {
    this._element.querySelector(`.point form`).addEventListener(`submit`, this._onSubmit);
  }

  _setupInterractive() {
    this._element.querySelector(`.travel-way__select`)
      .addEventListener(`change`, this._onSelectWay);
    this._element.querySelector(`.point__time .point__input`)
      .addEventListener(`change`, this._onChangeTime);
  }

  _onSelectWay(event) {
    this._type = event.target.value;
    this.reRender();
  }

  _feelTime(string) {
    this._timeObject.startHour = parseInt(string.slice(0, 2), 10);
    this._timeObject.startMinutes = parseInt(string.slice(3, 5), 10);
    this._timeObject.endHour = parseInt(string.slice(8, 10), 10);
    this._timeObject.endMinutes = parseInt(string.slice(11, 13), 10);
  }

  _generateError(min, max) {
    return `
      Invalid value entered! Enter a value in the format from ${min} to ${max}`;
  }

  _validateTime(string) {
    const startTime = string.split(` `)[0];
    const endTime = string.split(` `)[2];
    let error = ``;

    if (startTime.length !== 5 || endTime.length !== 5) {
      error = `Invalid value entered! Enter a value in the format ${FORMAT_TIME}`;
    } else if (this._timeObject.startHour > parseInt(MAX_HOURS_START, 10) || this._timeObject.startHour < parseInt(MIN_HOURS, 10)) {
      error = this._generateError(MIN_HOURS, MAX_HOURS_START);
    } else if (this._timeObject.startMinutes > parseInt(MAX_MINUTES, 10) || this._timeObject.startMinutes < parseInt(MIN_MINUTES, 10) ||
      this._timeObject.endMinutes > parseInt(MAX_MINUTES, 10) || this._timeObject.endMinutes < parseInt(MIN_MINUTES, 10)) {
      error = this._generateError(MAX_MINUTES, MIN_MINUTES);
    } else if (parseInt(this._timeObject.endHour, 10) < parseInt(this._timeObject.startHour, 10)) {
      error = `Invalid value entered! The end time of the event must be later than its start!`;
    } else if (this._timeObject.endHour > parseInt(MAX_HOURS, 10) || this._timeObject.endHour < parseInt(MIN_HOURS, 10)) {
      error = this._generateError(MIN_HOURS, MAX_HOURS);
    }

    event.target.setCustomValidity(error);
  }

  _onChangeTime(event) {
    this._feelTime(event.target.value);
    this._validateTime(event.target.value);
  }

  render() {
    this._element = createElement(this.template);
    this.bind();
    this._setupInterractive();
    return this._element;
  }

  reRender() {
    const oldElement = this._element;
    this.unrender();
    oldElement.parentNode.replaceChild(this.render(), oldElement);
  }

  unbind() {
    this._element.querySelector(`.point form`).removeEventListener(`submit`, this._onSubmit);
  }

  unrender() {
    this.unbind();
    this._element.querySelector(`.travel-way__select`)
      .removeEventListener(`change`, this._onSelectWay);
    this._element.querySelector(`.point__time .point__input`)
      .removeEventListener(`change`, this._onChangeTime);
    this._element = null;
  }

  _gatherData() {
    const stringTime = this.element.querySelector(`.point__time .point__input`).value;
    this._feelTime(stringTime);
    return {
      id: this._id,
      type: this._element.querySelector(`.travel-way__select-input:checked`).value,
      destination: this._element.querySelector(`.point__destination-input`).value,
      time: stringTime,
      duration: getDuration(this._timeObject),
      price: this._element.querySelector(`.point__price .point__input`).value,
      specials: this._specials,
      text: this._text,
      src: this._src
    };
  }

  _onSubmit(event) {
    event.preventDefault();
    if (this._submitHandler) {
      this._submitHandler(this, this._gatherData());
    }
  }

  setOnSubmit(submitHandler) {
    this._submitHandler = submitHandler;
  }
}
