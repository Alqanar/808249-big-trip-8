const TYPES_MAP = {
  taxi: {
    icon: `🚕`,
    title: `Taxi to`
  },
  bus: {
    icon: `🚌`,
    title: `Get to`
  },
  train: {
    icon: `🚄`,
    title: `Get to`
  },
  ship: {
    icon: `🛳️`,
    title: `Take a boat trip on`
  },
  transport: {
    icon: `🚊`,
    title: `Get to stop`
  },
  drive: {
    icon: `🚗`,
    title: `Drive to`
  },
  flight: {
    icon: `✈️`,
    title: `Flight to`
  },
  checkIn: {
    icon: `🏨`,
    title: `Check into`
  },
  sightseeing: {
    icon: `🏛️`,
    title: `Take a look at`
  },
  restaurant: {
    icon: `🍴`,
    title: `Visit the restaurant`
  }
};

const createOffers = (specialsArray) => {
  let specials = ``;
  for (let special of specialsArray) {
    specials +=
      `<li>
        <button class="trip-point__offer">${special.name} +&euro;&nbsp;${special.price}</button>
      </li>`;
  }
  return specials;
};

const renderOffersTemplate = (specials) =>
  `<ul class="trip-point__offers">
    ${createOffers(specials)}
  </ul>`;

export const createCardTemplate = (element) =>
  `<article class="trip-point">
    <i class="trip-icon">${TYPES_MAP[element.type].icon}</i>
    <h3 class="trip-point__title">${TYPES_MAP[element.type].title} ${element.destination}</h3>
    <p class="trip-point__schedule">
      <span class="trip-point__timetable">${element.time.time.start}&nbsp;&mdash; ${element.time.time.end}</span>
      <span class="trip-point__duration">${element.time.duration}</span>
    </p>
    <p class="trip-point__price">&euro;&nbsp;${element.price}</p>
    ${renderOffersTemplate(element.specials)}
  </article>`;
