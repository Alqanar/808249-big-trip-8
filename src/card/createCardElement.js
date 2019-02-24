import {
  createElement
} from '../utils.js';
import {
  createCardTemplate
} from './createCardTemplate.js';


export const createCardElement = (elementArray) =>
  createElement(createCardTemplate(elementArray));
