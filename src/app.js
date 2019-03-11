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

const onClickCard = (card) => {
  const cardEdit = new CardEdit(card.data);
  cardEdit.render();
  containerCards.replaceChild(cardEdit.element, card.element);
  cardEdit.setOnSubmit((dataCard) => {
    card.saveChanges(dataCard);
    card.render();
    containerCards.replaceChild(card.element, cardEdit.element);
    cardEdit.unrender();
  });
  card.unrender();
};

export const renderBoardCards = (data) => {
  containerCards.innerHTML = ``;
  const fragment = document.createDocumentFragment();
  for (let element of data) {
    let card = new Card(element);
    card.setOnClick(onClickCard);
    fragment.appendChild(card.render());
  }
  containerCards.appendChild(fragment);
};


containerElementFilter.addEventListener(
    `click`,
    () => renderBoardCards(preparedData.slice(0, getRandomInteger(1, 7))
    )
);
