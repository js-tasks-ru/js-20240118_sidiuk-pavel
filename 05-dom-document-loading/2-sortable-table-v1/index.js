export default class SortableTableV1 {
  element;
  subElements;

  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data;
    this.element = this.createElement(this.createTemplate());
    this.subElements = this.getSubElements();
  }

  createElement(template) {
    const element = document.createElement('div');
    element.innerHTML = template;
    return element.firstElementChild;
  }


  createTemplate() {
    return (`
      <div data-element="productsContainer" class="products-list__container">
        <div class="sortable-table">
          <div data-element="header" class="sortable-table__header sortable-table__row">
              ${this.createHeaderTemplate(this.headerConfig)}
          </div>
          <div data-element="body" class="sortable-table__body">
              ${this.createBodyTemplate(this.headerConfig, this.data)}
          </div>
          <div data-element="loading" class="loading-line sortable-table__loading-line"></div>
          <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
            <div>
              <p>No products satisfies your filter criteria</p>
              <button type="button" class="button-primary-outline">Reset all filters</button>
            </div>
          </div>
        </div>
      </div>
    `);
  }

  getSubElements() {
    const elements = this.element.querySelectorAll("[data-element]");

    const accumulateSubElements = (subElements, currentElement) => {
      subElements[currentElement.dataset.element] = currentElement;

      return subElements;
    };

    return [...elements].reduce(accumulateSubElements, {});
  }

  createHeaderTemplate(headerConfig) {
    return headerConfig.map(config => this.createHeaderCellTemplate(config)).join('');
  }

  createHeaderCellTemplate(config) {
    return `
      <div class="sortable-table__cell" data-id="${config.id}" data-sortable="${config.sortable}" data-order="">
        <span>${config.title}</span>
        <span data-element="arrow" class="sortable-table__sort-arrow">
          <span class="sort-arrow"></span>
        </span>
      </div>`;
  }

  createBodyTemplate(headerConfig, dataItems) {
    return dataItems.map(item => this.createRowTemplate(headerConfig, item)).join('');
  }

  createRowTemplate(headerConfig, item) {
    return `
       <a href="/products/3d-ochki-epson-elpgs03" class="sortable-table__row">
       ${headerConfig.map(config => this.createRowCellTemplate(config, item)).join('')}
      </a>`;
  }

  createRowCellTemplate(config, item) {
    if (config.template) {
      return config.template(item.images);
    }

    const fieldName = config['id'];
    const fieldValue = item[fieldName];
    return `<div class="sortable-table__cell">${fieldValue}</div>`;
  }


  sort(fieldValue = 'title', orderValue = 'desc') {
    const orders = {
      'desc': 1,
      'asc': -1,
    };

    const sortedData = [...this.data].sort((itemA, itemB) => {
      const k = orders[orderValue];
      const valueA = itemA[fieldValue];
      const valueB = itemB[fieldValue];
      if (typeof valueA === 'string') {
        return k * valueB.localeCompare(valueA, 'ru-en', {caseFirst: 'upper'});
      }

      return k * (valueB - valueA);
    });

    let sortElem = document.querySelector(`[data-id = ${fieldValue}]`);
    sortElem.dataset.order = orderValue;
    this.subElements.body.innerHTML = this.createBodyTemplate(this.headerConfig, sortedData);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}

