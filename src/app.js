import Card from './card/card.js';
import CardEdit from './card/card-edit.js';
import Filters from './filters/filters.js';
import Statistic from './statistic/statistic.js';
import LocalModel from './local-model.js';
import Sorter from './sorter.js';

import {
  createElement
} from './utils.js';
import {
  NamesFilterDict
} from './filters/namesFilterDict.js';

const MESSAGE_STYLE = `style="width: 100%; text-align: center;"`;
const main = document.querySelector(`.main`);
const containerElementFilter = document.querySelector(`.trip-controls__menus.view-switch`);
const containerCards = document.querySelector(`.trip-day__items`);
const loading = createElement(`<p ${MESSAGE_STYLE}>Loading route...</p>`);
const error = createElement(`<p ${MESSAGE_STYLE}>Something went wrong while loading your route info. Check your connection or try again later</p>`);
let activeLink = document.querySelector(`.view-switch__item--active`);

let localModel;
const statistic = new Statistic([]);
const sorter = new Sorter();
sorter.setElement(main.querySelector(`.trip-sorting`));


export const init = (apiParams, storeParams) => {
  localModel = new LocalModel(apiParams, storeParams);

  containerCards.appendChild(loading);
  sorter.setOnchangeSort(renderWithSorting);

  localModel.init()
    .then(() => {
      if (localModel.getSavedData().length) {
        containerCards.removeChild(loading);
        renderBoardCards(localModel.getSavedData());
      }
    })
    .catch(() => {
      containerCards.removeChild(loading);
      containerCards.appendChild(error);
    });
};

const renderWithSorting = () => {
  renderBoardCards(sorter.sort(localModel.getSavedData()));
};

const onChangeFilter = (filtersId) => {
  let dataToRender = [];
  const dateNow = new Date().getTime();
  switch (filtersId) {
    case `filter-everything`:
      dataToRender = localModel.getSavedData();
      break;

    case `filter-future`:
      dataToRender = localModel.getSavedData().filter(({time: {dateStart}}) => dateStart.getTime() > dateNow);
      break;

    case `filter-past`:
      dataToRender = localModel.getSavedData().filter(({time: {dateEnd}}) => dateEnd.getTime() < dateNow);
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


const deleteCard = (cardEditInstance) => {
  cardEditInstance.disableView();
  cardEditInstance.changeTextOnButtonDelete(`Deleting...`);

  localModel.deletePoint(cardEditInstance.id)
    .then(() => {
      cardEditInstance.enableView();
      cardEditInstance.changeTextOnButtonDelete(`Delete`);
      cardEditInstance.destroy();
    })
    .catch(() => {
      cardEditInstance.enableView();
      cardEditInstance.changeTextOnButtonDelete(`Delete`);
      cardEditInstance.showError();
    });
};

const onClickCard = (card) => {
  const cardEdit = new CardEdit(card.data, localModel.getSavedDestinations(), localModel.getSavedOffers());
  cardEdit.render();
  card.replace(cardEdit);
  cardEdit.setOnSubmit((dataCard) => {
    card.saveChanges(dataCard);

    cardEdit.disableView();
    cardEdit.changeTextOnButtonSave(`Saving...`);

    localModel.updatePoint(dataCard)
      .then(() => {
        cardEdit.enableView();
        cardEdit.changeTextOnButtonSave(`Save`);
        card.render();
        cardEdit.replace(card);
        cardEdit.unrender();
      })
      .catch(() => {
        cardEdit.enableView();
        cardEdit.changeTextOnButtonSave(`Save`);
        cardEdit.showError();
      });
  });
  cardEdit.setOnDelete(deleteCard);
  card.unrender();
};

const renderBoardCards = (data = localModel.getSavedData()) => {
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
  statistic.renderCharts(localModel.getSavedData());
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

window.addEventListener(`offline`, () => {
  document.title = `[OFFLINE] ${document.title}`;
});

window.addEventListener(`online`, () => {
  document.title = `Big Trip`;
  localModel.syncTasks();
});
