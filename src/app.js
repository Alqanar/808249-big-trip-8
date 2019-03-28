import Card from './card/card.js';
import CardEdit from './card/card-edit.js';
import Filters from './filters/filters.js';
import Statistic from './statistic/statistic.js';
import API from './api.js';
import {
  transformData,
  transformDataToServer,
  createElement,
  getObjectElements,
  block,
  unblock
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

  containerCards.appendChild(loading);

  api.getPoints()
    .then((points) => {
      savedData = points.filter(Boolean).map(transformData);
      if (savedData.length) {
        containerCards.removeChild(loading);
        renderBoardCards(savedData);
      }
    })
    .catch(() => {
      containerCards.removeChild(loading);
      containerCards.appendChild(error);
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
  cardEditInstance.element.style.boxShadow = `0 11px 20px 0 rgba(0,0,0,0.22)`;
  const elements = getObjectElements(cardEditInstance);
  const buttonDelete = cardEditInstance.element.querySelector(`.point__button--save + .point__button`);

  block({
    inputs: elements.inputs,
    buttons: elements.buttons,
    button: buttonDelete,
    text: `Deleting...`
  });

  api.deletePoints(cardEditInstance.id)
    .then(() => {
      unblock({
        inputs: elements.inputs,
        buttons: elements.buttons,
        button: buttonDelete,
        text: `Delete`
      });
      savedData.splice(soughtId, 1);
      cardEditInstance.destroy();
    })
    .catch(() => {
      unblock({
        inputs: elements.inputs,
        buttons: elements.buttons,
        button: buttonDelete,
        text: `Delete`
      });
      cardEditInstance.element.style.boxShadow = `0 0 10px 0 red`;
      cardEditInstance.shake();
    });
};

const sync = (newDataObj) => {
  return api.updatePoints({id: newDataObj.id, data: transformDataToServer(newDataObj)})
    .then((updateData) => {
      const dataForUser = transformData(updateData);
      savedData = savedData.map((element) => {
        if (element.id === dataForUser.id) {
          return dataForUser;
        }
        return element;
      });
    });
};

const onClickCard = (card) => {
  const cardEdit = new CardEdit(card.data, savedDestinations, savedOffers);
  cardEdit.render();
  card.replace(cardEdit);
  cardEdit.setOnSubmit((dataCard) => {
    cardEdit.element.style.boxShadow = `0 11px 20px 0 rgba(0,0,0,0.22)`;
    card.saveChanges(dataCard);

    const elements = getObjectElements(cardEdit);
    const buttonSave = cardEdit.element.querySelector(`.point__button--save`);

    block({
      inputs: elements.inputs,
      buttons: elements.buttons,
      button: buttonSave,
      text: `Saving...`
    });

    sync(dataCard)
      .then(() => {
        unblock({
          inputs: elements.inputs,
          buttons: elements.buttons,
          button: buttonSave,
          text: `Save`
        });
        card.render();
        cardEdit.replace(card);
        cardEdit.unrender();
      })
      .catch(() => {
        unblock({
          inputs: elements.inputs,
          buttons: elements.buttons,
          button: buttonSave,
          text: `Save`
        });
        cardEdit.element.style.boxShadow = `0 0 10px 0 red`;
        cardEdit.shake();
      });
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
