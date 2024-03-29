export default class ColumnChartV1 {
  element;
  chartHeight = 50;

  constructor({
    data = [],
    label = '',
    value = 0,
    link = '',
    formatHeading = value => value,
  } = {}) {
    this.label = label;
    this.data = data;
    this.value = value;
    this.link = link;
    this.formatHeading = formatHeading;
    this.element = this.creatElement(this.createTemplate());
  }

  creatElement(template) {
    const element = document.createElement('div');
    element.innerHTML = template;
    return element.firstElementChild;
  }

  getColumnProps() {
    const maxValue = Math.max(...this.data);
    const scale = 50 / maxValue;

    return this.data.map(item => {
      return {
        percent: (item / maxValue * 100).toFixed(0) + '%',
        value: String(Math.floor(item * scale))
      };
    });
  }

  createLinkTemplate() {
    if (this.link) {
      return `<a href="${this.link}" class="column-chart__link">View all</a>`;
    }
    return '';

  }

  createChartBodyTemplate() {
    return this.getColumnProps().map(({percent, value}) => (
      `<div style="--value: ${value}" data-tooltip="${percent}"></div>`
    )).join('');

  }

  createChartClasses() {
    return this.data.length ? 'column-chart' : 'column-chart column-chart_loading';

  }

  createTemplate() {
    return (`
    <div class="${this.createChartClasses()}" style="--chart-height: 50">
      <div class="column-chart__title">
        ${this.label}
        ${this.createLinkTemplate()}
      </div>
      <div class="column-chart__container">
        <div data-element="header" class="column-chart__header">${this.formatHeading(this.value)}</div>
        <div data-element="body" class="column-chart__chart">
          ${this.createChartBodyTemplate(this.data)}
        </div>
      </div>
    </div>`);
  }

  update(newDate) {
    this.data = newDate;
    this.element.querySelector('[data-element="body"]').innerHTML = this.createChartBodyTemplate(this.data);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
