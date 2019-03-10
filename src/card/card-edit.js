import {
  createElement,
  parseTimeToString,
  getDuration,
  validateTime
} from '../utils.js';
import {
  getTemplate
} from './createCardEditTemplate.js';


export default class CardEdit {
  constructor(data) {
    this._data = data;

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
    return getTemplate(this._data);
  }

  get element() {
    return this._element;
  }

  get container() {
    return this._element.parentNode;
  }

  bind() {
    this._element.querySelector(`.point form`).addEventListener(`submit`, this._onSubmit);
    this._element.querySelector(`.travel-way__select`).addEventListener(`change`, this._onSelectWay);
    this._element.querySelector(`.point__time .point__input`).addEventListener(`change`, this._onChangeTime);
  }

  _onSelectWay(event) {
    this._data.type = event.target.value;
    this.reRender();
  }

  _feelTime(string) {
    this._timeObject.startHour = parseInt(string.slice(0, 2), 10);
    this._timeObject.startMinutes = parseInt(string.slice(3, 5), 10);
    this._timeObject.endHour = parseInt(string.slice(8, 10), 10);
    this._timeObject.endMinutes = parseInt(string.slice(11, 13), 10);
  }

  _changeSeparatorTime(target) { /* TO DO */ /* If delete minutes in the start time, then hour become equal NaN */
    if (typeof (this._timeObject.startMinutes) !== `number` || isNaN(this._timeObject.startMinutes)) {
      this._timeObject.startMinutes = 0;
    }
    if (typeof (this._timeObject.endMinutes) !== `number` || isNaN(this._timeObject.endMinutes)) {
      this._timeObject.endMinutes = 0;
    }
    target.value = parseTimeToString(this._timeObject);
  }

  _validateTime(target) {
    target.setCustomValidity(validateTime(target.value, this._timeObject));
  }

  _onChangeTime(event) {
    this._feelTime(event.target.value);
    this._changeSeparatorTime(event.target);
    this._validateTime(event.target);
  }

  render() {
    this._element = createElement(this.template);
    this.bind();
    return this._element;
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
  }

  unrender() {
    this.unbind();
    this._element = null;
  }

  _gatherData() {
    const stringTime = this.element.querySelector(`.point__time .point__input`).value;
    this._feelTime(stringTime);
    return {
      id: this._data.id,
      type: this._element.querySelector(`.travel-way__select-input:checked`).value,
      destination: this._element.querySelector(`.point__destination-input`).value,
      time: stringTime,
      duration: getDuration(this._timeObject),
      price: this._element.querySelector(`.point__price .point__input`).value,
      specials: this._data.specials,
      text: this._data.text,
      src: this._data.src
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
