export default class Store {
  constructor({
    pointsKey,
    destinationsKey,
    offersKey,
    storage
  }) {
    this._storage = storage;
    this._pointsKey = pointsKey;
    this._destinationsKey = destinationsKey;
    this._offersKey = offersKey;
  }

  clearPoints() {
    this._storage.setItem(this._pointsKey, `{}`);
  }

  getAll() {
    const emptyItems = {};
    const items = this._storage.getItem(this._pointsKey);

    try {
      return JSON.parse(items);
    } catch (e) {
      window[`console`].error(`Error parse items. Error: ${e}. Items: ${items}`);
      return emptyItems;
    }
  }

  getDestinations() {
    const emptyItems = [];
    const destinations = this._storage.getItem(this._destinationsKey);

    try {
      return JSON.parse(destinations);
    } catch (e) {
      window[`console`].error(`Error parse items. Error: ${e}. Items: ${destinations}`);
      return emptyItems;
    }
  }

  getOffers() {
    const emptyItems = [];
    const offers = this._storage.getItem(this._offersKey);

    try {
      return JSON.parse(offers);
    } catch (e) {
      window[`console`].error(`Error parse items. Error: ${e}. Items: ${offers}`);
      return emptyItems;
    }
  }

  getPoint(key) {
    const items = this.getAll();
    return items[key];
  }

  setDestinations(destinations) {
    this._storage.setItem(this._destinationsKey, JSON.stringify(destinations));
  }

  setOffers(offers) {
    this._storage.setItem(this._offersKey, JSON.stringify(offers));
  }

  setPoint(key, item) {
    const items = this.getAll();
    items[key] = item;

    this._storage.setItem(this._pointsKey, JSON.stringify(items));
  }

  removePoint(key) {
    const items = this.getAll();
    delete items[key];

    this._storage.setItem(this._pointsKey, JSON.stringify(items));
  }
}

