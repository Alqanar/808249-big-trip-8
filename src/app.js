import {
  createFiltersElements
} from './filters/createFiltersElements.js';
import Card from './card/card.js';
import CardEdit from './card/card-edit.js';
import {
  preparedData
} from './data.js';
import {
  getRandomInteger
} from './utils.js';

const containerElementFilter = document.querySelector(`.trip-filter`);
const containerCards = document.querySelector(`.trip-day__items`);


export const renderFilters = (filterElements) => {
  containerElementFilter.innerHTML = ``;
  return containerElementFilter.appendChild(createFiltersElements(filterElements));
};


export const renderBoardCards = (data) => {
  containerCards.innerHTML = ``;
  for (let element of data) {
    let card = new Card(element);
    card.render(containerCards);
  }
};

export const renderBoardEditCard = (data) => {
  let cardEdit = new CardEdit(data[0]);
  cardEdit.render(containerCards);
};


containerElementFilter.addEventListener(
    `click`,
    () => renderBoardCards(preparedData.slice(0, getRandomInteger(1, 7))
    )
);
