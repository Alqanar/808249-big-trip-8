const cardsData = [
  {
    id: 1,
    type: `taxi`,
    destination: `Airport`,
    time: {
      start: `10.00`,
      end: `11.00`
    },
    duration: `1h 30m`,
    price: 20,
    specials: [`uber`, `business`]
  },
  {
    id: 2,
    type: `flight`,
    destination: `Geneva`,
    time: {
      start: `10.00`,
      end: `11.00`
    },
    duration: `1h 30m`,
    price: 20,
    specials: [`business`, `meal`]
  },
  {
    id: 3,
    type: `drive`,
    destination: `Chamonix`,
    time: {
      start: `10.00`,
      end: `11.00`
    },
    duration: `1h 30m`,
    price: 20,
    specials: [`rentCar`]
  },
  {
    id: 4,
    type: `checkIn`,
    destination: `hotel`,
    time: {
      start: `10.00`,
      end: `11.00`
    },
    duration: `1h 30m`,
    price: 20,
    specials: [`breakfast`]
  },
  {
    id: 5,
    type: `transport`,
    destination: `Gare Routière`,
    time: {
      start: `12.00`,
      end: `15.30`
    },
    duration: `3h 30m`,
    price: 10
  },
  {
    id: 6,
    type: `sightseeing`,
    destination: `Mausolée Brunswick`,
    time: {
      start: `16.00`,
      end: `17.00`
    },
    duration: `1h`,
    specials: [`individual`]
  },
  {
    id: 7,
    type: `restaurant`,
    destination: `Scandale`,
    time: {
      start: `18.30`,
      end: `20.00`
    },
    duration: `1h 30m`,
    price: 80,
    specials: [`table`]
  }
];

const Specials = {
  uber: {
    name: `Order UBER`,
    price: 20
  },
  business: {
    name: `Upgrade to business`,
    price: 20
  },
  meal: {
    name: `Select meal`,
    price: 20
  },
  rentCar: {
    name: `Rent a car`,
    price: 200
  },
  breakfast: {
    name: `Add breakfast`,
    price: 20
  },
  individual: {
    name: `Individual guide`,
    price: 300
  },
  table: {
    name: `Order a specific table`,
    price: 15
  }
};

const prepareDataForTemplate = (data) => {
  const {
    id,
    type,
    destination,
    time,
    duration,
    price = 0,
    specials = []
  } = data;

  return {
    id,
    type,
    destination,
    time,
    duration,
    price,
    specials: specials.map((element) => {
      return {...Specials[element]};
    })
  };
};

export const preparedData = cardsData.map((element) => prepareDataForTemplate(element));
