import API from './api.js';
import Store from './store.js';
import {
  transformDataToCard,
  transformDataToServer,
  generateId,
  objectToArray
} from './utils.js';


export default class LocalModel {
  constructor(apiParams, storeParams) {

    this._api = new API(apiParams);
    this._store = new Store(storeParams);
    this._needSync = false;
  }

  init() {
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

  deletePoint(id) {
    if (this._isOnline()) {
      return this._api.deletePoint(id)
        .then(() => {
          this._store.removePoint(id);
        });
    } else {
      this._needSync = true;
      this._store.removePoint(id);
      return Promise.resolve(true);
    }
  }

  updatePoints(newDataObj) {
    if (this._isOnline()) {
      return this._api.updatePoints({id: newDataObj.id, data: transformDataToServer(newDataObj)})
      .then((updateData) => {
        this._store.setPoint(updateData.id, updateData);
      });
    } else {
      const data = transformDataToServer(newDataObj);
      this._needSync = true;
      this._store.setPoint(data.id, data);
      return Promise.resolve();
    }
  }

  createPoint(point) {
    if (this._isOnline()) {
      return this._api.createPoints(point)
        .then((createPoint) => {
          this._store.setPoint(createPoint.id, createPoint);
        });
    } else {
      point.id = generateId();
      this._needSync = true;
      this._store.setPoint(point.id, transformDataToServer(point));
      return Promise.resolve();
    }
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
}
