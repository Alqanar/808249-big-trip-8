import cloneDeep from 'lodash/cloneDeep';

import BaseComponent from '../base-component.js';
import {
  getCardTemplate
} from './get-card-template.js';


export default class Card extends BaseComponent {
  constructor(data) {
    super(data);

    this._onCardClick = null;
    this._onCardClickInner = this._onCardClickInner.bind(this);
  }

  get _template() {
    return getCardTemplate(this._data);
  }

  get data() {
    return cloneDeep(this._data);
  }

  saveChanges(newData) {
    this._data = newData;
  }

  setOnClick(onCardClick) {
    this._onCardClick = onCardClick;
  }

  _bind() {
    this._element.addEventListener(`click`, this._onCardClickInner);
  }

  _onCardClickInner(event) {
    if (this._onCardClick) {
      event.preventDefault();
      this._onCardClick(this);
    }
  }

  _unBind() {
    this._element.removeEventListener(`click`, this._onCardClickInner);
  }
}
