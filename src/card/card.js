import cloneDeep from 'lodash/cloneDeep';

import BaseComponent from '../base-component.js';
import {
  getCardTemplate
} from './get-card-template.js';


export default class Card extends BaseComponent {
  constructor(data) {
    super(data);

    this._onClickInjected = null;
    this._onClick = this._onClick.bind(this);
  }

  get template() {
    return getCardTemplate(this._data);
  }

  get data() {
    return cloneDeep(this._data);
  }

  saveChanges(newData) {
    this._data = newData;
  }

  setOnClick(onClickInjected) {
    this._onClickInjected = onClickInjected;
  }

  _bind() {
    this._element.addEventListener(`click`, this._onClick);
  }

  _onClick(event) {
    if (this._onClickInjected) {
      event.preventDefault();
      this._onClickInjected(this);
    }
  }

  _unBind() {
    this._element.removeEventListener(`click`, this._onClick);
  }
}
