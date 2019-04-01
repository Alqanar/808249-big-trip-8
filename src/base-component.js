import {
  createElement
} from './utils.js';

export default class BaseComponent {
  constructor(data) {
    if (new.target === BaseComponent) {
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

  get container() {
    return this._element.parentNode;
  }

  get id() {
    return this._data.id;
  }

  replace(instance) {
    this.container.replaceChild(instance.element, this.element);
  }

  bind() {}

  unbind() {}

  render() {
    this._element = createElement(this.template);
    this.bind();
    return this._element;
  }

  reRender() {
    const oldElement = this._element;
    this.unbind();
    this.container.replaceChild(this.render(), oldElement);
  }

  unrender() {
    this.unbind();
    this._element = null;
  }
}
