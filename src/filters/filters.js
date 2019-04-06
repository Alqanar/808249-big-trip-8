import BaseComponent from '../base-component.js';

import {
  getFilterTemplate
} from './createFilterTemplate.js';

export default class Filters extends BaseComponent {
  constructor(data) {
    super(data);

    this._filterKind = `everything`;
    this._onChangeFilter = this._onChangeFilter.bind(this);
    this._onChangeFilterInjected = null;
  }

  get template() {
    return getFilterTemplate(this._data);
  }

  bind() {
    this._element.addEventListener(`change`, this._onChangeFilter);
  }

  _filterOutFuture(data) {
    const dateNow = new Date().getTime();
    return data.filter(({time: {dateStart}}) => dateStart.getTime() > dateNow);
  }

  _filterOutPast(data) {
    const dateNow = new Date().getTime();
    return data.filter(({time: {dateEnd}}) => dateEnd.getTime() < dateNow);
  }

  filterOut(data) {
    switch (this._filterKind) {
      case `future`:
        return this._filterOutFuture(data);
      case `past`:
        return this._filterOutPast(data);
      default:
        return data;
    }
  }

  unbind() {
    this._element.removeEventListener(`change`, this._onChangeFilter);
  }

  _onChangeFilter() {
    event.preventDefault();
    this._filterKind = event.target.value;
    if (this._onChangeFilterInjected) {
      this._onChangeFilterInjected(event.target.id);
    }
  }

  setOnChangeFilter(onChangeFilterInjected) {
    this._onChangeFilterInjected = onChangeFilterInjected;
  }
}
