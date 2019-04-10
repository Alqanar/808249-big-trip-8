import BaseComponent from './base-component.js';

import {
  getRawDuration,
  countSpecialPrice
} from './utils.js';

export default class Sorter extends BaseComponent {
  constructor() {
    super();

    this._onChangeSort = this._onChangeSort.bind(this);
    this._sortHandler = null;
    this._sortKind = `event`;
  }

  changeDisabled(status) {
    const inputs = this._element.querySelectorAll(`input`);
    inputs.forEach((input) => {
      input.disabled = status;
    });
  }

  setElement(domElement) {
    this._element = domElement;
    this._bind();
  }

  setOnchangeSort(sortHandler) {
    this._sortHandler = sortHandler;
  }

  sort(data) {
    switch (this._sortKind) {
      case `time`:
        return this._sortByTime(data);
      case `price`:
        return this._sortByPrice(data);
      default:
        return this._sortById(data);
    }
  }

  _bind() {
    this._element.addEventListener(`change`, this._onChangeSort);
  }

  _onChangeSort(event) {
    event.preventDefault();
    this._sortKind = event.target.value;
    if (this._sortHandler) {
      this._sortHandler();
    }
  }

  _sortById(data) {
    return data.sort((a, b) => parseInt(a.id, 10) - parseInt(b.id, 10));
  }

  _sortByPrice(data) {
    return data.sort((a, b) => (b.price + countSpecialPrice(b.specials) - (a.price + countSpecialPrice(a.specials))));
  }

  _sortByTime(data) {
    return data.sort((a, b) => getRawDuration(b.time).asMilliseconds() - getRawDuration(a.time).asMilliseconds());
  }

  _unBind() {
    this._element.querySelector(`.trip-sorting`).removeEventListener(`change`, this._onChangeSort);
  }
}
