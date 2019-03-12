import {
  createElement
} from '../utils.js';

export default class ComponentCard {
  constructor(data) {
    if (new.target === ComponentCard) {
      throw new Error(`Can't instantiate Component, only concrete one.`);
    }

    this._data = data;

    this._element = null;
  }

  get template() {
    throw new Error(`You have to define template.`);
  }

  get element() {
    return this._element;
  }

  bind() {}

  unbind() {}

  render() {
    this._element = createElement(this.template);
    this.bind();
    return this._element;
  }

  unrender() {
    this.unbind();
    this._element = null;
  }
}
