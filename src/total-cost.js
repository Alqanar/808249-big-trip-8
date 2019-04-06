import BaseComponent from './base-component.js';

import {
  countSpecialPrice
} from './utils.js';

export default class TotalCost extends BaseComponent {

  setElement(domElement) {
    this._element = domElement;
  }

  _countTotalCost(data) {
    return data.reduce((sum, {price, specials}) =>
      sum + price + countSpecialPrice(specials), 0);
  }

  render(data) {
    this._element.innerHTML = `&euro;&nbsp;${this._countTotalCost(data)}`;
  }
}
