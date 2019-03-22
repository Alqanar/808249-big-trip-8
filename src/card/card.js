import cloneDeep from 'lodash/cloneDeep';

import BaseComponent from '../base-component.js';
import {
  getTemplate
} from './createCardTemplate.js';


export default class Card extends BaseComponent {
  constructor(data) {
    super(data);

    this._onClickInjected = null;
    this._onClick = this._onClick.bind(this);
  }

  get template() {
    return getTemplate(this._data);
  }

  get data() {
    return cloneDeep(this._data);
  }

  bind() {
    this._element.addEventListener(`click`, this._onClick);
  }

  unbind() {
    this._element.removeEventListener(`click`, this._onClick);
  }

  _onClick(event) {
    if (this._onClickInjected) {
      event.preventDefault();
      this._onClickInjected(this);
    }
  }

  setOnClick(onClickInjected) {
    this._onClickInjected = onClickInjected;
  }

  saveChanges(newData) {
    this._data = newData;
  }
}
