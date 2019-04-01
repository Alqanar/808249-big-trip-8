import API from './api.js';
import {
  transformDataToCard,
  transformDataToServer
} from './utils.js';


export default class LocalModel {
  constructor(params) {

    this._api = new API(params);
    this._savedData = [];
    this._savedOffers = [];
    this._savedDestinations = [];
  }

  init() {
    return Promise.all([
      this._fetchData(),
      this._fetchDestinations(),
      this._fetchOffers()
    ]);
  }

  _fetchData() {
    return this._api.getPoints()
      .then((points) => {
        this._savedData = points.filter(Boolean).map(transformDataToCard);
      });
  }

  _fetchDestinations() {
    return this._api.getDestinations()
      .then((destinations) => {
        this._savedDestinations = destinations;
      });
  }

  _fetchOffers() {
    return this._api.getOffers()
    .then((offers) => {
      this._savedOffers = offers;
    });
  }

  getSavedData() {
    return this._savedData;
  }

  getSavedDestinations() {
    return this._savedDestinations;
  }

  getSavedOffers() {
    return this._savedOffers;
  }

  deletePoint(id) {
    return this._api.deletePoint(id)
      .then(() => {
        const index = this._savedData.findIndex((item) => item.id === id);
        this._savedData.splice(index, 1);
      });
  }

  updatePoints(newDataObj) {
    return this._api.updatePoints({id: newDataObj.id, data: transformDataToServer(newDataObj)})
    .then((updateData) => {
      const dataForUser = transformDataToCard(updateData);
      this._savedData = this._savedData.map((element) => {
        return (element.id === dataForUser.id) ? dataForUser : element;
      });
    });
  }
}
