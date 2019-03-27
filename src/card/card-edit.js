import flatpickr from 'flatpickr';

import BaseComponent from '../base-component.js';
import {
  getDuration
} from '../utils.js';
import {
  getTemplate
} from './createCardEditTemplate.js';


export default class CardEdit extends BaseComponent {
  constructor(data) {
    super(data);

    this._submitHandler = null;
    this._deleteHandler = null;
    this._onSubmit = this._onSubmit.bind(this);
    this._onDelete = this._onDelete.bind(this);
    this._onSelectWay = this._onSelectWay.bind(this);
    this._onChangeDestination = this._onChangeDestination.bind(this);
    this._onChangePrice = this._onChangePrice.bind(this);
  }

  get template() {
    return getTemplate(this._data);
  }

  bind() {
    // this._timeInput = this._element.querySelector(`.point__time .point__input`);
    const time = this._data.time;
    this._element.querySelector(`.point form`).addEventListener(`submit`, this._onSubmit);
    this._element.querySelector(`.travel-way__select`).addEventListener(`change`, this._onSelectWay);
    this._element.querySelector(`.point__destination-input`).addEventListener(`change`, this._onChangeDestination);
    this._element.querySelector(`.point__price .point__input`).addEventListener(`change`, this._onChangePrice);
    this._element.querySelector(`.point__buttons [type="reset"]`).addEventListener(`click`, this._onDelete);

    flatpickr(
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

    flatpickr(
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

  _onSelectWay(event) {
    this._data.type = event.target.value;
    this.reRender();
  }

  _onChangeDestination(event) {
    this._data.destination = event.target.value;
  }

  _onChangePrice(event) {
    this._data.price = parseInt(event.target.value, 10);
  }

  reRender() {
    const oldElement = this._element;
    this.unbind();
    this.container.replaceChild(this.render(), oldElement);
  }

  unbind() {
    this._element.querySelector(`.point form`).removeEventListener(`submit`, this._onSubmit);
    this._element.querySelector(`.travel-way__select`).removeEventListener(`change`, this._onSelectWay);
    this._element.querySelector(`.point__destination-input`).removeEventListener(`change`, this._onChangeDestination);
    this._element.querySelector(`.point__price .point__input`).removeEventListener(`change`, this._onChangePrice);
    this._element.querySelector(`.point__buttons [type="reset"]`).removeEventListener(`click`, this._onDelete);
  }

  _onSubmit(event) {
    event.preventDefault();
    if (this._submitHandler) {
      this._data.duration = getDuration(this._data.time);
      this._submitHandler(this._data);
    }
  }

  setOnSubmit(submitHandler) {
    this._submitHandler = submitHandler;
  }

  _onDelete(event) {
    event.preventDefault();
    if (this._deleteHandler) {
      this._deleteHandler(this);
    }
  }

  setOnDelete(deleteHandler) {
    this._deleteHandler = deleteHandler;
  }

  destroy() {
    this.container.removeChild(this._element);
    this.unrender();
  }
}
