const createFilterTemplate = (filter) =>
  `<input
  type="radio"
  id="${filter.id}"
  name="filter"
  value="${filter.label}"
  ${filter.checked ? `checked` : ``}
  />
  <label class="trip-filter__item" for="${filter.id}">
  ${filter.label}</label
  >`;

const crateFiltersTemplate = (arrayFilters) => {
  let filtersContainer = ``;
  for (let elementFilter of arrayFilters) {
    filtersContainer += createFilterTemplate(elementFilter);
  }
  return filtersContainer;
};


export const getFilterTemplate = (arrayFilter) =>
  `<form class="trip-filter">
    ${crateFiltersTemplate(arrayFilter)}
  </form>`;
