import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';
const ITEMS_PER_REQUEST = 20;
export default class SortableTable {
  pagination = {};
  element;
  subElements;

  constructor(headersConfig, {
    data = [], sorted = {}, url = '', isSortLocally = false,
  } = {}) {
    this.headerConfig = headersConfig;
    this.data = data;
    this.element = this.createElement(this.createTemplate());
    this.subElements = this.getSubElements();
    this.url = url;
    this.sorted = sorted;
    this.isSortLocally = isSortLocally;
    this.pagination.start = 1;
    this.pagination.end = ITEMS_PER_REQUEST + this.pagination.start;
    this.createEventListeners();
    this.render();

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

  createRequestURL(id, order) {
    const url = new URL(this.url, BACKEND_URL);

    const {
      pagination: {start, end},
      fieldValue = id,
      orderValue = order,

    } = this;

    url.searchParams.set("_sort", fieldValue);
    url.searchParams.set("_order", orderValue);
    url.searchParams.set("_start", start);
    url.searchParams.set("_end", end);


    return url;
  }

  async loadData(id, order,) {
    if (this.url) {
      const url = this.createRequestURL(id, order);
      this.showLoader(true);
      const data = await fetchJson(url);
      this.showLoader(false);
      return data;
    }
    return this.data;
  }

  showLoader(status) {
    const {loading} = this.subElements;
    loading.style.display = status === true ? "block" : "none";
  }

  async sortOnClient(id, order) {
    this.data = await this.loadData();
    this.subElements.body.innerHTML = this.createBodyTemplate(this.headerConfig, this.data);
    this.sort(id, order, this.data);
    this.pagination.end += ITEMS_PER_REQUEST;

  }


  async sortOnServer(id, order) {
    this.data = await this.loadData(id, order);
    this.pagination.end += ITEMS_PER_REQUEST;
    if (this.data.length) {
      this.subElements.body.innerHTML = this.createBodyTemplate(this.headerConfig, this.data);
    } else {
      this.showLoader(true);
    }
  }

  createEventListeners() {
    this.subElements.header.addEventListener('pointerdown', this.handleDocumentClick);
    window.addEventListener("scroll", this.handleBodyScroll);
  }

  removeEventListeners() {
    //this.subElements.header.removeEventListeners('pointerdown', this.handleDocumentClick); если удаляю то падают все тесты
    window.removeEventListener("scroll", this.handleBodyScroll);
  }

  handleDocumentClick = (event) => {
    event.preventDefault();
    let elemSortable = event.target.closest('[data-id]').dataset.sortable;
    let elemId = event.target.closest('[data-id]').dataset.id;


    if (elemSortable === "true") {
      this.sorted = {
        id: elemId,
        order: this.sorted.order === 'desc' ? 'asc' : 'desc',
      };
      this.render(this.sorted.id, this.sorted.order);

    }
  }

  handleBodyScroll = (event) => {
    const totalScrollHeight =
      document.documentElement.scrollHeight - window.innerHeight;

    const currentScrollPosition =
      window.scrollY || document.documentElement.scrollTop;

    if (currentScrollPosition >= totalScrollHeight) {
      if (this.subElements.loading.style.display !== "block") {
        this.render();
      }
    }
  }

  async render(id = this.headerConfig.find((item) => item.sortable).id, order = "asc") {
    if (this.isSortLocally === true) {
      await this.sortOnClient(id, order);
    } else {
      await this.sortOnServer(id, order);
    }
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    this.removeEventListeners();
  }
}
