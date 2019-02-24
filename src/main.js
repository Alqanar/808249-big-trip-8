import {
  createFiltersElements
} from './filters/createFiltersElements.js';
import {
  NamesFilterDict
} from './filters/namesFilterDict.js';
import {
  createCardElement
} from './card/createCardElement.js';
import {
  preparedData
} from './data.js';


const containerElementFilter = document.querySelector(`.trip-filter`);
const containerCards = document.querySelector(`.trip-day__items`);


const renderFilters = (filterElements) => {
  containerElementFilter.innerHTML = ``;
  return containerElementFilter.appendChild(createFiltersElements(filterElements));
};

renderFilters(NamesFilterDict);


const createCardsFragment = (arrayCards) => {
  let cardsFragment = document.createDocumentFragment();
  for (let elementCards of arrayCards) {
    cardsFragment.appendChild(createCardElement(elementCards));
  }
  return cardsFragment;
};

const renderBoardCards = (cardsFragment) => {
  containerCards.innerHTML = ``;
  return containerCards.appendChild(cardsFragment);
};

renderBoardCards(createCardsFragment(preparedData));
