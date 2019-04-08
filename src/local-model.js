import moment from 'moment';

import API from './api.js';
import Store from './store.js';
import {
  transformDataToCard,
  transformDataToServer,
  generateId,
  objectToArray,
  getDuration
} from './utils.js';


export default class LocalModel {
  constructor(apiParams, storeParams) {

    this._api = new API(apiParams);
    this._store = new Store(storeParams);
    this._needSync = false;
  }

  init() {
    if (!this._isOnline()) {
      document.title = `[OFFLINE] ${document.title}`;
    }

    return Promise.all([
      this._fetchPoints(),
      this._fetchDestinations(),
      this._fetchOffers()
    ]);
  }

  _fetchPoints() {
    if (this._isOnline()) {
      return this._api.getPoints()
        .then((points) => {
          this._store.clearPoints();
          points.map((element) => this._store.setPoint(element.id, element));
        });
    }
    return Promise.resolve(objectToArray(this._store.getAll()));
  }

  _fetchDestinations() {
    if (this._isOnline()) {
      return this._api.getDestinations()
        .then((destinations) => {
          this._store.setDestinations(destinations);
        });
    }
    return Promise.resolve(this._store.getDestinations());
  }

  _fetchOffers() {
    if (this._isOnline()) {
      return this._api.getOffers()
      .then((offers) => {
        this._store.setOffers(offers);
      });
    }
    return Promise.resolve(this._store.getOffers());
  }

  getSavedData() {
    return objectToArray(this._store.getAll()).map(transformDataToCard);
  }

  getSavedDestinations() {
    return this._store.getDestinations();
  }

  getSavedOffers() {
    return this._store.getOffers();
  }

  _callAction(onlineAction, offlineAction) {
    if (this._isOnline()) {
      return onlineAction();
    } else {
      offlineAction();
      this._needSync = true;
      return Promise.resolve(true);
    }
  }

  _deletePointOnline(id) {
    return this._api.deletePoint(id)
        .then(() => {
          this._store.removePoint(id);
        });
  }

  deletePoint(id) {
    return this._callAction(
        () => this._deletePointOnline(id),
        () => this._store.removePoint(id)
    );
  }

  _updatePointOnline(newDataObj) {
    return this._api.updatePoint({id: newDataObj.id, data: transformDataToServer(newDataObj)})
      .then((updateData) => {
        this._store.setPoint(updateData.id, updateData);
      });
  }

  updatePoint(newDataObj) {
    return this._callAction(
        () => this._updatePointOnline(newDataObj),
        () => {
          const data = transformDataToServer(newDataObj);
          this._store.setPoint(data.id, data);
        }
    );
  }

  _createPointOnline(point) {
    return this._api.createPoints(transformDataToServer(point))
        .then((createPoint) => {
          this._store.setPoint(createPoint.id, createPoint);
        });
  }

  createPoint(point) {
    return this._callAction(
        () => this._createPointOnline(point),
        () => {
          point.id = generateId();
          this._store.setPoint(point.id, transformDataToServer(point));
        }
    );
  }

  _isOnline() {
    return window.navigator.onLine;
  }

  syncTasks() {
    if (this._needSync) {
      return this._api.syncTasks(objectToArray(this._store.getAll()))
        .then(() => {
          this._needSync = false;
        });
    }
    return Promise.resolve();
  }

  _getOffersForNewEvent() {
    const typeOfNewEvent = `taxi`;
    const offersForNewEvent = this.getSavedOffers().find((element) => element.type === typeOfNewEvent);
    return (offersForNewEvent) ? offersForNewEvent.offers : [];
  }

  getDataForNewEvent() {
    const time = {};
    time.dateStart = new Date(moment().startOf(`day`).valueOf());
    time.dateEnd = new Date(moment().startOf(`day`).valueOf());
    return {'id': generateId(),
      'isNewCard': true,
      'type': `taxi`,
      'destination': ``,
      'time': time,
      'duration': getDuration(time),
      'price': 0,
      'specials': this._getOffersForNewEvent(),
      'text': ``,
      'pictures': [],
      'favorite': false
    };
  }
}
