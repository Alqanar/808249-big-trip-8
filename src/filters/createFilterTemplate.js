export const createFilterTemplate = (filter) =>
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
