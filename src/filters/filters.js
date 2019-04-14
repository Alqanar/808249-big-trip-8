import BaseComponent from '../base-component.js';

import {
  getFilterTemplate
} from './get-filter-template.js';

const filterOutFuture = (data) => {
  const dateNow = new Date().getTime();
  return data.filter(({time: {dateStart}}) => dateStart.getTime() > dateNow);
};

const filterOutPast = (data) => {
  const dateNow = new Date().getTime();
  return data.filter(({time: {dateEnd}}) => dateEnd.getTime() < dateNow);
};

export default class Filters extends BaseComponent {
  constructor(data) {
    super(data);

    this._filterKind = `everything`;
    this._onFilterChangeInner = this._onFilterChangeInner.bind(this);
    this._onFilterChange = null;
  }

  get _template() {
    return getFilterTemplate(this._data);
  }

  filterOut(data) {
    switch (this._filterKind) {
      case `future`:
        return filterOutFuture(data);
      case `past`:
        return filterOutPast(data);
      default:
        return data;
    }
  }

  setOnChange(onFilterChange) {
    this._onFilterChange = onFilterChange;
  }

  _bind() {
    this._element.addEventListener(`change`, this._onFilterChangeInner);
  }

  _onFilterChangeInner(event) {
    event.preventDefault();
    this._filterKind = event.target.value;
    if (this._onFilterChange) {
      this._onFilterChange(event.target.id);
    }
  }

  _unBind() {
    this._element.removeEventListener(`change`, this._onFilterChangeInner);
  }
}
