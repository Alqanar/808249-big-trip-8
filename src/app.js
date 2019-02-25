import {
  createFiltersElements
} from './filters/createFiltersElements.js';
import {
  createCardElement
} from './card/createCardElement.js';
import {
  preparedData
} from './data.js';
import {
  getRandomInteger
} from './utils';

const containerElementFilter = document.querySelector(`.trip-filter`);
const containerCards = document.querySelector(`.trip-day__items`);


export const renderFilters = (filterElements) => {
  containerElementFilter.innerHTML = ``;
  return containerElementFilter.appendChild(createFiltersElements(filterElements));
};


export const createCardsFragment = (arrayCards) => {
  let cardsFragment = document.createDocumentFragment();
  for (let elementCards of arrayCards) {
    cardsFragment.appendChild(createCardElement(elementCards));
  }
  return cardsFragment;
};

export const renderBoardCards = (cardsFragment) => {
  containerCards.innerHTML = ``;
  return containerCards.appendChild(cardsFragment);
};


containerElementFilter.addEventListener(
    `click`,
    () => renderBoardCards(
        createCardsFragment(preparedData.slice(0, getRandomInteger(1, 7)))
    )
);
