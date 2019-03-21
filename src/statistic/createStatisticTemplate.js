export const getStatisticTemplate = () =>
  `<section class="statistic content-wrap" id="stats">
    <div class="statistic__item statistic__item--money">
      <canvas class="statistic__money" width="900"></canvas>
    </div>

    <div class="statistic__item statistic__item--transport">
      <canvas class="statistic__transport" width="900"></canvas>
    </div>

    <div class="statistic__item statistic__item--time-spend">
      <canvas class="statistic__time-spend" width="900"></canvas>
    </div>
  </section>`;
