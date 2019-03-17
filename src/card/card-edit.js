import moment from 'moment';
import flatpickr from 'flatpickr';

import ComponentCard from './component-card.js';
import {
  getDuration
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
    const time = this._data.time;
    this._element.querySelector(`.point form`).addEventListener(`submit`, this._onSubmit);
    this._element.querySelector(`.travel-way__select`).addEventListener(`change`, this._onSelectWay);
    this._element.querySelector(`.point__destination-input`).addEventListener(`change`, this._onChangeDestination);
    this._element.querySelector(`.point__price .point__input`).addEventListener(`change`, this._onChangePrice);

    flatpickr(
        this._timeInput,
        {mode: `range`,
          dateFormat: `H:i`,
          defaultDate: [time.dateStart.toDate(), time.dateEnd.toDate()],
          enableTime: true,
          onClose: (selectedDates) => {
            this._data.time.dateStart = moment(selectedDates[0]);
            this._data.time.dateEnd = moment(selectedDates[1]);
            this._data.duration = getDuration(this._data.time);
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
