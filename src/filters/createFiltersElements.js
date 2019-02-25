import {
  createElement
} from '../utils.js';
import {
  createFilterTemplate
} from './createFilterTemplate.js';

let filterElement = ``;

export const createFiltersElements = (array) => {
  for (let elementArray of array) {
    filterElement += createFilterTemplate(elementArray);
  }
  return createElement(filterElement);
};
