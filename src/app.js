import Card from './card/card.js';
import CardEdit from './card/card-edit.js';
import Filters from './filters/filters.js';
import Statistic from './statistic/statistic.js';
import LocalModel from './local-model.js';
import Sorter from './sorter.js';
import TotalCost from './total-cost.js';

import {
  createElement,
  ESC_KEYCODE
} from './utils.js';
import {
  NAMES_FILTER_DICT
} from './filters/names-filter-dict.js';

const MESSAGE_STYLE = `style="width: 100%; text-align: center;"`;
const buttonForNewEvent = document.querySelector(`.trip-controls__new-event`);
const main = document.querySelector(`.main`);
const containerFilter = document.querySelector(`.trip-controls__menus.view-switch`);
const containerCards = document.querySelector(`.trip-day__items`);
const loading = createElement(`<p ${MESSAGE_STYLE}>Loading route...</p>`);
const error = createElement(`<p ${MESSAGE_STYLE}>Something went wrong while loading your route info. Check your connection or try again later</p>`);
let openedCards = [];
let activeLink = document.querySelector(`.view-switch__item--active`);

let localModel;
let filter;
const statistic = new Statistic([]);
const sorter = new Sorter();
sorter.setElement(main.querySelector(`.trip-sorting`));
const totalCost = new TotalCost();
totalCost.setElement(document.querySelector(`.trip__total-cost`));


export const init = (apiParams, storeParams) => {
  localModel = new LocalModel(apiParams, storeParams);

  containerCards.appendChild(loading);
  sorter.setOnChange(fullRender);

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


const fullRender = () => {
  if (!openedCards.length) {
    renderBoardCards(filter.filterOut(sorter.sort(localModel.getSavedData())));
  }
};

const renderFilters = (filterData) => {
  filter = new Filters(filterData);
  const formFilter = containerFilter.querySelector(`.trip-filter`);
  if (formFilter) {
    containerFilter.removeChild(formFilter);
  }
  containerFilter.appendChild(filter.render());

  filter.setOnChange(fullRender);
};

renderFilters(NAMES_FILTER_DICT);

const changeStatusDisabledButton = () => {
  const inputs = containerFilter.querySelectorAll(`input`);
  const status = !!openedCards.length;
  inputs.forEach((input) => {
    input.disabled = status;
  });
  sorter.changeDisabled(status);
};

const deleteCardCallback = (cardEditInstance) => {
  cardEditInstance.disableView();
  cardEditInstance.changeTextOnButtonDelete(`Deleting...`);

  localModel.deletePoint(cardEditInstance.id)
    .then(() => {
      cardEditInstance.enableView();
      cardEditInstance.changeTextOnButtonDelete(`Delete`);
      openedCards = openedCards.filter(({cardEdit}) => cardEdit.id !== cardEditInstance.id);
      changeStatusDisabledButton();
      cardEditInstance.destroy();
      totalCost.render(localModel.getSavedData());
    })
    .catch(() => {
      cardEditInstance.enableView();
      cardEditInstance.changeTextOnButtonDelete(`Delete`);
      cardEditInstance.showError();
    });
};

const getSubmitCallback = (card, cardEdit, method) => (dataCard) => {
  let point = card;
  let performMethod = localModel[method];
  if (point) {
    point.saveChanges(dataCard);
  }
  delete dataCard.isNewCard;
  cardEdit.disableView();
  cardEdit.changeTextOnButtonSave(`Saving...`);

  performMethod.call(localModel, dataCard)
    .then(() => {
      cardEdit.enableView();
      cardEdit.changeTextOnButtonSave(`Save`);
      openedCards = openedCards.filter(({cardEdit: elem}) => elem.id !== dataCard.id);
      changeStatusDisabledButton();
      if (!point) {
        point = new Card(dataCard);
      }
      point.render();
      cardEdit.replace(point);
      cardEdit.unRender();
      buttonForNewEvent.disabled = false;
      fullRender();
    })
    .catch(() => {
      cardEdit.enableView();
      cardEdit.changeTextOnButtonSave(`Save`);
      cardEdit.showError();
    });
};

const clickCardCallback = (card) => {
  const cardEdit = new CardEdit(card.data, localModel.getSavedDestinations(), localModel.getSavedOffers());
  cardEdit.render();
  openedCards.push({cardEdit, card});
  changeStatusDisabledButton();
  card.replace(cardEdit);

  cardEdit.setOnSubmit(getSubmitCallback(card, cardEdit, `updatePoint`));

  cardEdit.setOnDelete(deleteCardCallback);
  card.unRender();
};

const renderBoardCards = (data = localModel.getSavedData()) => {
  containerCards.innerHTML = ``;
  const fragment = document.createDocumentFragment();
  data.forEach((element) => {
    let card = new Card(element);
    card.setOnClick(clickCardCallback);
    fragment.appendChild(card.render());
  });
  containerCards.appendChild(fragment);
  totalCost.render(data);
};

const renderStatistic = () => {
  const containerStatistic = document.querySelector(`.statistic`);
  if (containerStatistic) {
    statistic.reRender();
  } else {
    document.body.appendChild(statistic.render());
  }
  statistic.renderCharts(localModel.getSavedData());
};

containerFilter.addEventListener(`click`, (e) => {
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

document.addEventListener(`keydown`, (event) => {
  if (event.keyCode === ESC_KEYCODE) {
    const lastPair = openedCards.pop();
    changeStatusDisabledButton();
    if (!lastPair.card) {
      lastPair.cardEdit.destroy();
      buttonForNewEvent.disabled = false;
    } else {
      lastPair.card.render();
      lastPair.cardEdit.replace(lastPair.card);
      lastPair.cardEdit.unRender();
    }
  }
});

buttonForNewEvent.addEventListener(`click`, () => {
  buttonForNewEvent.disabled = true;
  const dataForNewEvent = localModel.getDataForNewCard();
  const cardEdit = new CardEdit(dataForNewEvent, localModel.getSavedDestinations(), localModel.getSavedOffers());
  containerCards.insertBefore(cardEdit.render(), containerCards.firstChild);
  openedCards.push({cardEdit, card: undefined});
  changeStatusDisabledButton();

  cardEdit.setOnSubmit(getSubmitCallback(undefined, cardEdit, `createPoint`));

  cardEdit.setOnDelete(() => {
    cardEdit.disableView();
    cardEdit.changeTextOnButtonDelete(`Deleting...`);
    cardEdit.destroy();
    buttonForNewEvent.disabled = false;
  });
});
