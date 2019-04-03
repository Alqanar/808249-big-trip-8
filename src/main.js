import {
  init
} from './app.js';


init({
  endPoint: `https://es8-demo-srv.appspot.com/big-trip`,
  authorization: `Basic 5rma8r57w60e007`
}, {
  pointsKey: `points-store-key`,
  destinationsKey: `destinations-store-key`,
  offersKey: `offers-store-key`,
  storage: localStorage
});
