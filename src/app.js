import {
  createFiltersElements
} from './filters/createFiltersElements.js';
import Card from './card/card.js';
import CardEdit from './card/card-edit.js';
// import {
//   preparedData
// } from './data.js';
import {
  getRandomInteger
} from './utils.js';

const containerElementFilter = document.querySelector(`.trip-filter`);
const containerCards = document.querySelector(`.trip-day__items`);
let savedData = [];


export const renderFilters = (filterElements) => {
  containerElementFilter.innerHTML = ``;
  return containerElementFilter.appendChild(createFiltersElements(filterElements));
};

const onClickCard = (card) => {
  const cardEdit = new CardEdit(card.data);
  cardEdit.render();
  card.replace(cardEdit);
  cardEdit.setOnSubmit((dataCard) => {
    card.saveChanges(dataCard);
    card.render();
    cardEdit.replace(card);
    cardEdit.unrender();
  });
  cardEdit.setOnDelete(deleteTask);
  card.unrender();
};

export const renderBoardCards = () => {
  containerCards.innerHTML = ``;
  const fragment = document.createDocumentFragment();
  for (let element of savedData) {
    let card = new Card(element);
    card.setOnClick(onClickCard);
    fragment.appendChild(card.render());
  }
  containerCards.appendChild(fragment);
};

export const setData = (preparedData) => {
  savedData = preparedData;
};

const deleteTask = (cardEditInstance) => {
  const soughtId = savedData.findIndex((element) =>
    element.id === cardEditInstance.id
  );
  savedData.splice(soughtId, 1);
  cardEditInstance.destroy();
};


containerElementFilter.addEventListener(
    `click`,
    () => renderBoardCards(savedData.slice(0, getRandomInteger(1, 7))
    )
);
