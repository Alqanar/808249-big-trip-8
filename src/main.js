import {
  NamesFilterDict
} from './filters/namesFilterDict.js';
import {
  preparedData
} from './data.js';
import {
  renderFilters,
  renderBoardCards,
  createCardsFragment
} from './app.js';


renderFilters(NamesFilterDict);

renderBoardCards(createCardsFragment(preparedData));
