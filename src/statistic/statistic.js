import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';


import BaseComponent from '../base-component.js';
import {
  getStatisticTemplate,
  getStatisticInnerTemplate
} from './createStatisticTemplate.js';
import {
  TYPES_MAP
} from '../trip-types.js';
import {
  countSpecialPrice,
  getRawDuration
} from '../utils.js';

const BAR_HEIGHT = 55;

const getLabel = (obj, elementData) => {
  const label = TYPES_MAP[elementData.type].icon + ` ` + elementData.type;
  if (!obj[label]) {
    obj[label] = 0;
  }
  return label;
};

export default class Statistic extends BaseComponent {
  constructor(data) {
    super(data);
  }

  get template() {
    return getStatisticTemplate();
  }

  changeStealthSwitch() {
    this._element.classList.toggle(`visually-hidden`);
  }

  _getMoneySummary() {
    let moneySummary = {};
    for (let elementData of this._data) {
      const label = getLabel(moneySummary, elementData);
      moneySummary[label] += elementData.price + countSpecialPrice(elementData.specials);
    }
    return moneySummary;
  }

  _getUseOfTransport() {
    let useOfTransport = {};
    for (let elementData of this._data) {
      if (TYPES_MAP[elementData.type].type === `move`) {
        const label = getLabel(useOfTransport, elementData);
        useOfTransport[label] += 1;
      }
    }
    return useOfTransport;
  }

  _getDurationOfTypePoint() {
    let durationOfTypePoint = {};
    for (let elementData of this._data) {
      const label = getLabel(durationOfTypePoint, elementData);
      durationOfTypePoint[label] += Math.round(getRawDuration(elementData.time).asHours());
    }
    return durationOfTypePoint;
  }

  _drawGraph(domElement, methodForCreationData, title, format) {
    const labelsType = Object.keys(methodForCreationData);
    const sums = Object.values(methodForCreationData);
    domElement.height = BAR_HEIGHT * labelsType.length;
    return new Chart(domElement, {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: labelsType,
        datasets: [{
          data: sums,
          backgroundColor: `#ffffff`,
          hoverBackgroundColor: `#ffffff`,
          anchor: `start`
        }]
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: 13
            },
            color: `#000000`,
            anchor: `end`,
            align: `start`,
            formatter: format
          }
        },
        title: {
          display: true,
          text: title,
          fontColor: `#000000`,
          fontSize: 23,
          position: `left`
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: `#000000`,
              padding: 5,
              fontSize: 13,
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            barThickness: 44,
          }],
          xAxes: [{
            ticks: {
              display: false,
              beginAtZero: true,
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            minBarLength: 50
          }],
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: false,
        }
      }
    });
  }

  updateView() {
    this._element.innerHTML = getStatisticInnerTemplate();
  }

  renderCharts(dataForGraph) {
    this._data = dataForGraph;
    this._drawGraph(this.element.querySelector(`.statistic__money`), this._getMoneySummary(), `MONEY`, (val) => `€ ${val}`);
    this._drawGraph(this.element.querySelector(`.statistic__transport`), this._getUseOfTransport(), `TRANSPORT`, (val) => `${val}x`);
    this._drawGraph(this.element.querySelector(`.statistic__time-spend`), this._getDurationOfTypePoint(), `TIME SPENT`, (val) => `${val}H`);
  }
}
