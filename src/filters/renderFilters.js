import {
  createElement
} from '../utils.js';
import {
  createFilterTemplate
} from './createFilterTemplate.js';

const containerElementFilter = document.querySelector(`.trip-filter`);
let filterElement = ``;

const createFiltersTemplate = (array) => {
  for (let elementArray of array) {
    filterElement += createFilterTemplate(elementArray);
  }
  return createElement(filterElement);
};

export const renderFilters = (filterElements) => {
  containerElementFilter.innerHTML = ``;
  return containerElementFilter.appendChild(createFiltersTemplate(filterElements));
};
