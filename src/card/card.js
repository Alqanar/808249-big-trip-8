import {
  createElement
} from '../utils.js';
import {
  getTemplate
} from './createCardTemplate.js';


export default class Card {
  constructor(data) {
    this._data = data;

    this._element = null;
    this._onClickInjected = null;
    this._onClick = this._onClick.bind(this);
  }

  get template() {
    return getTemplate(this._data);
  }

  get element() {
    return this._element;
  }

  get id() {
    return this._data.id;
  }

  bind() {
    this._element.addEventListener(`click`, this._onClick);
  }

  render() {
    this._element = createElement(this.template);
    this.bind();
    return this._element;
  }

  unbind() {
    this._element.removeEventListener(`click`, this._onClick);
  }

  unrender() {
    this.unbind();
    this._element = null;
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
}
