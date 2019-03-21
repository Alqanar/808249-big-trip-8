import Card from './card/card.js';
import CardEdit from './card/card-edit.js';
import Filters from './filters/filters.js';
import Statistic from './statistic/statistic.js';
// import {
//   getRandomInteger
// } from './utils.js';

const main = document.querySelector(`.main`);
const containerElementFilter = document.querySelector(`.trip-controls__menus.view-switch`);
const containerCards = document.querySelector(`.trip-day__items`);
const linkTable = containerElementFilter.querySelector(`.view-switch__item:first-of-type`);
const linkStatistic = containerElementFilter.querySelector(`.view-switch__item:last-of-type`);
let savedData = [];


export const setData = (preparedData) => {
  savedData = preparedData;
};

const onChangeFilter = (filtersId) => {
  let dataToRender = [];
  const dateNow = Date.now();
  switch (filtersId) {
    case `filter-everything`:
      dataToRender = savedData;
      break;

    case `filter-future`:
      dataToRender = savedData.filter(({time: {dateStart}}) => dateStart.getTime() > dateNow);
      break;

    case `filter-past`:
      dataToRender = savedData.filter(({time: {dateEnd}}) => dateEnd.getTime() < dateNow);
      break;
  }
  renderBoardCards(dataToRender);
};

export const renderFilters = (filterData) => {
  const filter = new Filters(filterData);
  const formFilter = containerElementFilter.querySelector(`.trip-filter`);
  if (formFilter) {
    containerElementFilter.removeChild(formFilter);
  }
  containerElementFilter.appendChild(filter.render());

  filter.setOnChangeFilter(onChangeFilter);
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

const renderStatistic = (dataForStats) => {
  const statistic = new Statistic(dataForStats);
  const elementStatistic = document.querySelector(`.statistic`);
  if (elementStatistic) {
    document.body.removeChild(elementStatistic);
  }
  document.body.appendChild(statistic.render());
  statistic.renderCharts();
};

linkTable.addEventListener(`click`, () => {
  if (!document.querySelector(`.statistic`).classList.contains(`visually-hidden`)) {
    document.querySelector(`.statistic`).classList.add(`visually-hidden`);
  }
  if (main.classList.contains(`visually-hidden`)) {
    main.classList.remove(`visually-hidden`);
  }
  if (linkStatistic.classList.contains(`view-switch__item--active`)) {
    linkStatistic.classList.remove(`view-switch__item--active`);
  }
  if (!linkTable.classList.contains(`view-switch__item--active`)) {
    linkTable.classList.add(`view-switch__item--active`);
  }
});

linkStatistic.addEventListener(`click`, () => {
  if (!main.classList.contains(`visually-hidden`)) {
    main.classList.add(`visually-hidden`);
  }
  renderStatistic(savedData);
  if (linkTable.classList.contains(`view-switch__item--active`)) {
    linkTable.classList.remove(`view-switch__item--active`);
  }
  if (!linkStatistic.classList.contains(`view-switch__item--active`)) {
    linkStatistic.classList.add(`view-switch__item--active`);
  }
});

/* Повесить обработчик события click на ссылки (`Table` и `Stats`), которые будут отвечать за изменение класса у ссылки и добавление/удаление класса visually-hedden у блока статистики/main */

