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

  get container() {
    return this._element.parentNode;
  }

  get element() {
    return this._element;
  }

  get id() {
    return this._data.id;
  }

  get template() {
    throw new Error(`You have to define template.`);
  }

  render() {
    this._element = createElement(this.template);
    this._bind();
    return this._element;
  }

  replace(instance) {
    this.container.replaceChild(instance.element, this.element);
  }

  reRender() {
    const oldElement = this._element;
    this._unBind();
    this.container.replaceChild(this.render(), oldElement);
  }

  unRender() {
    this._unBind();
    this._element = null;
  }

  _bind() {}

  _unBind() {}
}
