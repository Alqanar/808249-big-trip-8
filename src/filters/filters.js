import BaseComponent from '../base-component.js';

import {
  getFilterTemplate
} from './createFilterTemplate.js';

export default class Filters extends BaseComponent {
  constructor(data) {
    super(data);

    this._onChangeFilter = this._onChangeFilter.bind(this);
    this._onChangeFilterInjected = null;
  }

  get template() {
    return getFilterTemplate(this._data);
  }

  bind() {
    this._element.addEventListener(`change`, this._onChangeFilter);
  }

  unbind() {
    this._element.removeEventListener(`change`, this._onChangeFilter);
  }

  _onChangeFilter() {
    if (this._onChangeFilterInjected) {
      this._onChangeFilterInjected(event.target.id);
    }
  }

  setOnChangeFilter(onChangeFilterInjected) {
    this._onChangeFilterInjected = onChangeFilterInjected;
  }
}
