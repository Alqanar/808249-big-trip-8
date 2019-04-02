export default class Store {
  constructor({
    pointsKey,
    destonationsKey,
    offersKey,
    storage
  }) {
    this._storage = storage;
    this._pointsKey = pointsKey;
    this._destonationsKey = destonationsKey;
    this._offersKey = offersKey;
  }

  setPoint(key, item) {
    const items = this.getAll();
    items[key] = item;

    this._storage.setItem(this._pointsKey, JSON.stringify(items));
  }

  getPoint(key) {
    const items = this.getAll();
    return items[key];
  }

  setDestinations(destinations) {
    this._storage.setItem(this._destonationsKey, JSON.stringify(destinations));
  }

  getDestinations() {
    const emptyItems = [];
    const destinations = this._storage.getItem(this._destonationsKey);

    if (!destinations) {
      return emptyItems;
    }

    try {
      return JSON.parse(destinations);
    } catch (e) {
      window[`console`].error(`Error parse items. Error: ${e}. Items: ${destinations}`);
      return emptyItems;
    }
  }

  setOffers(offers) {
    this._storage.setItem(this._offersKey, JSON.stringify(offers));
  }

  getOffers() {
    const emptyItems = [];
    const offers = this._storage.getItem(this._offersKey);

    if (!offers) {
      return emptyItems;
    }

    try {
      return JSON.parse(offers);
    } catch (e) {
      window[`console`].error(`Error parse items. Error: ${e}. Items: ${offers}`);
      return emptyItems;
    }
  }

  removePoint(key) {
    const items = this.getAll();
    delete items[key];

    this._storage.setItem(this._pointsKey, JSON.stringify(items));
  }

  getAll() {
    const emptyItems = {};
    const items = this._storage.getItem(this._pointsKey);

    if (!items) {
      return emptyItems;
    }

    try {
      return JSON.parse(items);
    } catch (e) {
      window[`console`].error(`Error parse items. Error: ${e}. Items: ${items}`);
      return emptyItems;
    }
  }
}

