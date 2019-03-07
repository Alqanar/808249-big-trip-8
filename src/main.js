import {
  NamesFilterDict
} from './filters/namesFilterDict.js';
import {
  preparedData
} from './data.js';
import {
  renderFilters,
  renderBoardCards
} from './app.js';


renderFilters(NamesFilterDict);

renderBoardCards(preparedData);
