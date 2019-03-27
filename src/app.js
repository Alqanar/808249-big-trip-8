import Card from './card/card.js';
import CardEdit from './card/card-edit.js';
import Filters from './filters/filters.js';
import Statistic from './statistic/statistic.js';
import API from './api.js';
import {
  transformData
} from './utils.js';
import {
  NamesFilterDict
} from './filters/namesFilterDict.js';

const main = document.querySelector(`.main`);
const containerElementFilter = document.querySelector(`.trip-controls__menus.view-switch`);
const containerCards = document.querySelector(`.trip-day__items`);
let activeLink = document.querySelector(`.view-switch__item--active`);

let savedData = [];
let savedDestinations = [];
let savedOffers = [];
let api;
const statistic = new Statistic(savedData);

export const init = (address) => {
  api = new API(address);

  api.getDestinations()
    .then((destinations) => {
      savedDestinations = destinations;
    });

  api.getOffers()
    .then((offers) => {
      savedOffers = offers;
    });

  api.getPoints()
    .then((points) => {
      savedData = points.filter(Boolean).map(transformData);
      renderBoardCards(savedData);
    });
};

const onChangeFilter = (filtersId) => {
  let dataToRender = [];
  const dateNow = new Date().getTime();
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

const renderFilters = (filterData) => {
  const filter = new Filters(filterData);
  const formFilter = containerElementFilter.querySelector(`.trip-filter`);
  if (formFilter) {
    containerElementFilter.removeChild(formFilter);
  }
  containerElementFilter.appendChild(filter.render());

  filter.setOnChangeFilter(onChangeFilter);
};

renderFilters(NamesFilterDict);

const deleteTask = (cardEditInstance) => {
  const soughtId = savedData.findIndex((element) =>
    element.id === cardEditInstance.id
  );
  api.deletePoints(soughtId)
    .then(() => {
      savedData.splice(soughtId, 1);
      cardEditInstance.destroy();
    });
};

const sync = (newDataObj) => {
  savedData = savedData.map((element) => {
    if (element.id === newDataObj.id) {
      return newDataObj;
    }
    return element;
  });
};

const onClickCard = (card) => {
  const cardEdit = new CardEdit(card.data, savedDestinations, savedOffers);
  cardEdit.render();
  card.replace(cardEdit);
  cardEdit.setOnSubmit((dataCard) => {
    card.saveChanges(dataCard);
    sync(dataCard);
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

const renderStatistic = () => {
  const elementStatistic = document.querySelector(`.statistic`);
  if (elementStatistic) {
    statistic.updateView();
  } else {
    document.body.appendChild(statistic.render());
  }
  statistic.renderCharts(savedData);
};

containerElementFilter.addEventListener(`click`, (e) => {
  const {target} = e;
  if (target.closest(`.view-switch__item`) && target !== activeLink) {
    e.preventDefault();
    activeLink.classList.remove(`view-switch__item--active`);
    target.classList.add(`view-switch__item--active`);
    activeLink = target;
    main.classList.toggle(`visually-hidden`);
    renderStatistic();
    statistic.changeStealthSwitch();
  }
});
