// import flatpickr from 'flatpickr';
import moment from 'moment';

import ComponentCard from './component-card.js';
import {
  // parseTimeToString,
  getDuration,
  validateTime,
  changeSeparator
} from '../utils.js';
import {
  getTemplate
} from './createCardEditTemplate.js';


export default class CardEdit extends ComponentCard {
  constructor(data) {
    super(data);

    this._submitHandler = null;
    this._onSubmit = this._onSubmit.bind(this);
    this._onSelectWay = this._onSelectWay.bind(this);
    this._onChangeTime = this._onChangeTime.bind(this);
    this._onChangeDestination = this._onChangeDestination.bind(this);
    this._onChangePrice = this._onChangePrice.bind(this);

    this._timeObject = {
      startHour: null,
      startMinutes: null,
      endHour: null,
      endMinutes: null
    };
  }

  get template() {
    return getTemplate(this._data);
  }

  bind() {
    this._timeInput = this._element.querySelector(`.point__time .point__input`);
    this._element.querySelector(`.point form`).addEventListener(`submit`, this._onSubmit);
    this._element.querySelector(`.travel-way__select`).addEventListener(`change`, this._onSelectWay);
    this._timeInput.addEventListener(`change`, this._onChangeTime);
    this._element.querySelector(`.point__destination-input`).addEventListener(`change`, this._onChangeDestination);
    this._element.querySelector(`.point__price .point__input`).addEventListener(`change`, this._onChangePrice);

    // flatpickr(
    //     this._timeInput,
    //     {enableTime: true, noCalendar: true, dateFormat: `H:i`, time_24hr: true}
    // );
  }

  _onSelectWay(event) {
    this._data.type = event.target.value;
    this.reRender();
  }

  _fillTime(string) {
    this._timeObject.startHour = parseInt(string.slice(0, 2), 10);
    this._timeObject.startMinutes = parseInt(string.slice(3, 5), 10);
    this._timeObject.endHour = parseInt(string.slice(8, 10), 10);
    this._timeObject.endMinutes = parseInt(string.slice(11, 13), 10);
  }

  _changeSeparatorTime(target) {
    let timePassed = target.value;
    let newTimeString = ``;
    newTimeString = changeSeparator(timePassed, 2, timePassed[2]);
    timePassed = newTimeString;
    newTimeString = changeSeparator(timePassed, 10, timePassed[10]);

    target.value = newTimeString;
  }

  _validateTime(target) {
    target.setCustomValidity(validateTime(target.value, this._timeObject));
  }

  _getNewTime(string) {
    const dateStart = moment(`2019-03-18`);
    const dateEnd = moment(`2019-03-18`);
    dateStart.set(`hour`, parseInt(string.slice(0, 2), 10));
    dateStart.set(`minute`, parseInt(string.slice(3, 5), 10));
    dateEnd.set(`hour`, parseInt(string.slice(8, 10), 10));
    dateEnd.set(`minute`, parseInt(string.slice(11, 13), 10));
    return {
      dateStart,
      dateEnd
    };
  }

  _onChangeTime(event) {
    this._changeSeparatorTime(event.target);
    this._fillTime(event.target.value);
    this._validateTime(event.target);
    this._fillTime(event.target.value);
    this._data.time = this._getNewTime(event.target.value);
    this._data.duration = getDuration(this._getNewTime(event.target.value));
  }

  _onChangeDestination(event) {
    this._data.destination = event.target.value;
  }

  _onChangePrice(event) {
    this._data.price = event.target.value;
  }

  reRender() {
    const oldElement = this._element;
    this.unbind();
    this.container.replaceChild(this.render(), oldElement);
  }

  unbind() {
    this._element.querySelector(`.point form`).removeEventListener(`submit`, this._onSubmit);
    this._element.querySelector(`.travel-way__select`).removeEventListener(`change`, this._onSelectWay);
    this._element.querySelector(`.point__time .point__input`).removeEventListener(`change`, this._onChangeTime);
    this._element.querySelector(`.point__destination-input`).addEventListener(`change`, this._onChangeDestination);
    this._element.querySelector(`.point__price .point__input`).addEventListener(`change`, this._onChangePrice);
  }

  _gatherData() {
    return this._data;
  }

  _onSubmit(event) {
    event.preventDefault();
    if (this._submitHandler) {
      this._submitHandler(this._gatherData());
    }
  }

  setOnSubmit(submitHandler) {
    this._submitHandler = submitHandler;
  }
}
