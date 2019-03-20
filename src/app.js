import {
  getFilterTemplate
} from './filters/createFilterTemplate.js';
import Card from './card/card.js';
import CardEdit from './card/card-edit.js';
import {
  getRandomInteger
} from './utils.js';
import {
  createElement
} from './utils.js';

const containerElementFilter = document.querySelector(`.trip-controls__menus.view-switch`);
const containerCards = document.querySelector(`.trip-day__items`);
let savedData = [];


export const setData = (preparedData) => {
  savedData = preparedData;
};


export const renderFilters = (filterData) => {
  const formFilter = containerElementFilter.querySelector(`.trip-filter`);
  if (formFilter) {
    containerElementFilter.removeChild(formFilter);
  }
  containerElementFilter.appendChild(createElement(getFilterTemplate(filterData)));

  containerElementFilter.querySelector(`.trip-filter`).addEventListener(
      `click`,
      () => renderBoardCards(savedData.slice(0, getRandomInteger(1, 7))
      )
  );
};

const deleteTask = (cardEditInstance) => {
  const soughtId = savedData.findIndex((element) =>
    element.id === cardEditInstance.id
  );
  savedData.splice(soughtId, 1);
  cardEditInstance.destroy();
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

export const renderBoardCards = (data = savedData) => {
  containerCards.innerHTML = ``;
  const fragment = document.createDocumentFragment();
  for (let element of data) {
    let card = new Card(element);
    card.setOnClick(onClickCard);
    fragment.appendChild(card.render());
  }
  containerCards.appendChild(fragment);
};


// containerElementFilter.querySelector(`.trip-filter`).addEventListener(
//     `click`,
//     () => renderBoardCards(savedData.slice(0, getRandomInteger(1, 7))
//     )
// );
