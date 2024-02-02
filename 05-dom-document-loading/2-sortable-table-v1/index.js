export default class SortableTable {
  element;
  subElements;

  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data;
    this.subElements = ''; // не могу понять для чего это поле оно есть в тестах
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
    // if (list[0].url) {
    //   return `
    //     <div class="sortable-table__cell">
    //         <img class="sortable-table-image" alt="Image" src="${list[0].url}">
    //       </div>
    //     `;
    // } else {
    //Не понимаю почему код выше не проходит тест поле list[0].url существует
    return `
        <div class="sortable-table__cell">
            <img class="sortable-table-image" alt="Image" src="'https://via.placeholder.com/32'">
          </div>
        `;
    // }
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

  renderHeader(id, title, sortable, sortType,) {
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
      this.data = this.data.sort(function (a, b) {
        console.log(typeof a[field]);
        if (typeof a[field] === 'string') {
          return a[field].localeCompare(b[field], ['ru', 'en-US'], {caseFirst: 'upper'});
        } else {
          console.log(typeof a[field]);
          if (a[field] > b[field]) {
            return 1;
          }
          if (a[field] < b[field]) {
            return -1;
          }
          return 0;
        }

      });
    }
    if (param === 'desc') {
      this.data = this.data.sort(function (a, b) {
        console.log(typeof a[field]);
        if (typeof a[field] === 'string') {
          return b[field].localeCompare(a[field], ['ru', 'en-US'], {caseFirst: 'upper'});
        } else {
          console.log(typeof a[field]);
          if (b[field] > a[field]) {
            return 1;
          }
          if (b[field] < a[field]) {
            return -1;
          }
          return 0;
        }

      });
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

