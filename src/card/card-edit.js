import flatpickr from 'flatpickr';
import cloneDeep from 'lodash/cloneDeep';

import BaseComponent from '../base-component.js';
import {
  getDuration
} from '../utils.js';
import {
  getCardEditTemplate
} from './get-card-edit-template.js';


export default class CardEdit extends BaseComponent {
  constructor(data, destinations, offers) {
    super(data);

    this._destinations = destinations;
    this._offers = offers;
    this._submitHandler = null;
    this._deleteHandler = null;
    this._escPressHandler = null;
    this._onSubmit = this._onSubmit.bind(this);
    this._onDelete = this._onDelete.bind(this);
    this._onSelectWay = this._onSelectWay.bind(this);
    this._onChangeDestination = this._onChangeDestination.bind(this);
    this._onChangePrice = this._onChangePrice.bind(this);
    this._onChangeOffers = this._onChangeOffers.bind(this);
    this._onChangeFavorite = this._onChangeFavorite.bind(this);
    this._inputs = null;
    this._buttons = null;
    this._buttonDelete = null;
    this._buttonSave = null;
  }

  get template() {
    return getCardEditTemplate(this._data, this._destinations);
  }

  changeTextOnButtonDelete(text) {
    this._buttonDelete.innerHTML = text;
  }

  changeTextOnButtonSave(text) {
    this._buttonSave.innerHTML = text;
  }

  destroy() {
    this.container.removeChild(this._element);
    this.unRender();
  }

  disableView() {
    this._getObjectElements();
    this._element.style.boxShadow = `0 11px 20px 0 rgba(0,0,0,0.22)`;

    this._changeStatusDisabledElements(this._inputs, this._buttons, true);
  }

  enableView() {
    this._changeStatusDisabledElements(this._inputs, this._buttons, false);
  }

  setOnDelete(deleteHandler) {
    this._deleteHandler = deleteHandler;
  }

  setOnSubmit(submitHandler) {
    this._submitHandler = submitHandler;
  }

  showError() {
    const ANIMATION_TIMEOUT = 600;
    this._element.style.boxShadow = `0 0 10px 0 red`;
    this._element.style.animation = `shake ${ANIMATION_TIMEOUT / 1000}s`;

    setTimeout(() => {
      this._element.style.animation = ``;
    }, ANIMATION_TIMEOUT);
  }

  _bind() {
    const time = this._data.time;
    this._buttonDelete = this._element.querySelector(`.point__button--save + .point__button`);
    this._buttonSave = this._element.querySelector(`.point__button--save`);
    this._element.querySelector(`.point form`).addEventListener(`submit`, this._onSubmit);
    this._element.querySelector(`.travel-way__select`).addEventListener(`change`, this._onSelectWay);
    this._element.querySelector(`.point__destination-input`).addEventListener(`change`, this._onChangeDestination);
    this._element.querySelector(`.point__price .point__input`).addEventListener(`change`, this._onChangePrice);
    this._element.querySelector(`.point__offers-wrap`).addEventListener(`change`, this._onChangeOffers);
    this._element.querySelector(`.point__favorite-input`).addEventListener(`change`, this._onChangeFavorite);
    this._element.querySelector(`.point__buttons [type="reset"]`).addEventListener(`click`, this._onDelete);

    this._startPicker = flatpickr(
        this._element.querySelector(`.point__time .point__input:first-of-type`),
        {dateFormat: `H:i`,
          defaultDate: [time.dateStart],
          enableTime: true,
          onClose: (selectedDates) => {
            this._data.time.dateStart = selectedDates[0];
          },
          [`time_24hr`]: true
        }
    );

    this._endPicker = flatpickr(
        this._element.querySelector(`.point__time .point__input:last-of-type`),
        {dateFormat: `H:i`,
          defaultDate: [time.dateEnd],
          enableTime: true,
          onClose: (selectedDates) => {
            this._data.time.dateEnd = selectedDates[0];
          },
          [`time_24hr`]: true
        }
    );
  }

  _changeStatusDisabled(collection, status) {
    collection.forEach((element) => {
      element.disabled = status;
    });
  }

  _changeStatusDisabledElements(inputs, buttons, status) {
    this._changeStatusDisabled(inputs, status);
    this._changeStatusDisabled(buttons, status);
  }

  _getObjectElements() {
    this._inputs = this._element.querySelectorAll(`form input`);
    this._buttons = this._element.querySelectorAll(`form button`);
  }

  _onChangeFavorite(event) {
    this._data.favorite = event.target.checked;
  }

  _onChangeDestination(event) {
    this._data.destination = event.target.value;
    const foundDestination = this._destinations.find((element) => element.name === this._data.destination);

    this._data.text = foundDestination ? foundDestination.description : ``;
    this._data.pictures = foundDestination ? foundDestination.pictures.map(({src, description}) => ({src, value: description})) : [];
    this.reRender();
  }

  _onChangePrice(event) {
    this._data.price = parseInt(event.target.value, 10);
    this.reRender();
  }

  _onChangeOffers(event) {
    const foundOffer = this._data.specials.find((element) => element.name === event.target.value);
    if (foundOffer) {
      foundOffer.accepted = event.target.checked;
    }
    this.reRender();
  }

  _onDelete(event) {
    event.preventDefault();
    if (this._deleteHandler) {
      this._deleteHandler(this);
    }
  }

  _onSelectWay(event) {
    this._data.type = event.target.value;
    const foundOffers = this._offers.find((element) => element.type === this._data.type);
    this._data.specials = foundOffers ? cloneDeep(foundOffers.offers) : [];
    this.reRender();
  }

  _onSubmit(event) {
    event.preventDefault();
    if (this._submitHandler) {
      this._data.duration = getDuration(this._data.time);
      this._submitHandler(this._data);
    }
  }

  _unBind() {
    this._element.querySelector(`.point form`).removeEventListener(`submit`, this._onSubmit);
    this._element.querySelector(`.travel-way__select`).removeEventListener(`change`, this._onSelectWay);
    this._element.querySelector(`.point__destination-input`).removeEventListener(`change`, this._onChangeDestination);
    this._element.querySelector(`.point__price .point__input`).removeEventListener(`change`, this._onChangePrice);
    this._element.querySelector(`.point__offers-wrap`).removeEventListener(`change`, this._onChangeOffers);
    this._element.querySelector(`.point__favorite-input`).addEventListener(`change`, this._onChangeFavorite);
    this._element.querySelector(`.point__buttons [type="reset"]`).removeEventListener(`click`, this._onDelete);
    this._startPicker.destroy();
    this._endPicker.destroy();
  }
}
