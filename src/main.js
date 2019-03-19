import {
  NamesFilterDict
} from './filters/namesFilterDict.js';
import {
  preparedData
} from './data.js';
import {
  renderFilters,
  renderBoardCards,
  setData
} from './app.js';


renderFilters(NamesFilterDict);

setData(preparedData);

renderBoardCards();
