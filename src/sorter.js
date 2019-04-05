import BaseComponent from './base-component.js';

import {
  getRawDuration,
  countSpecialPrice
} from './utils.js';

export default class Sorter extends BaseComponent {
  constructor() {
    super();

    this._onChangeSort = this._onChangeSort.bind(this);
    this._sortKind = `event`;
    this._sortHandler = null;
  }

  setElement(domElement) {
    this._element = domElement;
    this.bind();
  }

  bind() {
    this._element.addEventListener(`change`, this._onChangeSort);
  }

  _sortingById(data) {
    return data.sort((a, b) => parseInt(a.id, 10) - parseInt(b.id, 10));
  }

  _sortingByTime(data) {
    return data.sort((a, b) => getRawDuration(b.time).milliseconds() - getRawDuration(a.time).milliseconds());
  }

  _sortingByPrice(data) {
    return data.sort((a, b) => (b.price + countSpecialPrice(b.specials) - (a.price + countSpecialPrice(a.specials))));
  }

  _onChangeSort(event) {
    event.preventDefault();
    this._sortKind = event.target.value;
    if (this._sortHandler) {
      this._sortHandler();
    }
  }

  setOnchangeSort(sortHandler) {
    this._sortHandler = sortHandler;
  }

  sort(data) {
    switch (this._sortKind) {
      case `time`:
        return this._sortingByTime(data);
      case `price`:
        return this._sortingByPrice(data);
      default:
        return this._sortingById(data);
    }
  }

  unbind() {
    this._element.querySelector(`.trip-sorting`).removeEventListener(`change`, this._onChangeSort);
  }
}
