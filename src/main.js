import {
  NamesFilterDict
} from './filters/namesFilterDict.js';
import {
  preparedData
} from './data.js';
import {
  renderFilters,
  renderBoardCards,
  renderBoardEditCard
} from './app.js';


renderFilters(NamesFilterDict);

renderBoardCards(preparedData);

renderBoardEditCard(preparedData);
