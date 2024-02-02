export default class SortableTable {
  element;

  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data;
    this.element = this.creatElement(this.createTemplate());
  }

  creatElement(template) {
    const element = document.createElement('div');
    element.innerHTML = template;
    return element.firstElementChild;
  }

  getHeaderProps(list) {
    return list.map(item => this.renderHeader(item.id, item.title, item.sortable, item.sortType, item.template)).join('');
  }

  getItemProps(list) {
    return list.map(item => this.renderItem(item.images, item.title, item.quantity, item.price, item.sales)).join('');
  }

  renderImg(list) {
    return `
        <div class="sortable-table__cell">
            <img class="sortable-table-image" alt="Image" src="${list[0]?.url || 'https://via.placeholder.com/32'}">
          </div>
        `;
  }

  renderItem(images, title, quantity, price, sales) {
    return `
       <a href="/products/3d-ochki-epson-elpgs03" class="sortable-table__row">
        ${this.renderImg(images)}
        <div class="sortable-table__cell">${title}</div>
        <div class="sortable-table__cell">${quantity}</div>
        <div class="sortable-table__cell">${price}</div>
        <div class="sortable-table__cell">${sales}</div>
      </a>`;
  }

  renderHeader(id, title, sortable, sortType, template) {
    return `
        <div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}" data-order="${sortType}">
        <span>${title}</span>
        <span data-element="arrow" class="sortable-table__sort-arrow">
          <span class="sort-arrow"></span>
        </span>
      </div>`;
  }

  createTemplate() {
    return (`
<div data-element="productsContainer" class="products-list__container">
  <div class="sortable-table">
     <div data-element="header" class="sortable-table__header sortable-table__row">
        ${this.getHeaderProps(this.headerConfig)}
    </div>
    <div data-element="body" class="sortable-table__body">
        ${this.getItemProps(this.data)}
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


  sort(field, param = 'asc') {

    if (param === 'asc') {
      this.data = this.data.sort((a, b) => String(a[field]).localeCompare(String(b[field]), ['ru', 'en-US'], {caseFirst: 'upper'}));

    }
    if (param === 'desc') {
      this.data = this.data.sort((a, b) => String(b[field]).localeCompare(String(a[field]), ['ru', 'en-US'], {caseFirst: 'upper'}));
    }

    this.element.querySelector('[data-element="body"]').innerHTML = this.getItemProps(this.data);

  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}

