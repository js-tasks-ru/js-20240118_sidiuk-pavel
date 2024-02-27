import SortableTableV1 from "../../05-dom-document-loading/2-sortable-table-v1/index.js";


export default class SortableTable extends SortableTableV1 {

  constructor(headersConfig, {
    data = [], sorted = {
      id: headerConfig.find(item => item.sortable).id,
      order: 'asc',
    },
  } = {}) {
    super(headersConfig, data);
    this.createEventListeners();
    this.sorted = sorted;

  }

  createEventListeners() {
    document.addEventListener('pointerdown', this.handleDocumentClick);
  }


  createHeaderCellTemplate(config) {
    return `
      <div class="sortable-table__cell" data-id="${config.id}" data-sortable="${config.sortable}">
        <span>${config.title}</span>
        ${this.createHeaderArrowTemplate()}
      </div>`;
  }

  createHeaderArrowTemplate() {
    return (`
            <span data-element="arrow" class="sortable-table__sort-arrow">
              <span class="sort-arrow"></span>
            </span>
        `);
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
      this.sort(this.sorted.id, this.sorted.order);
      console.log(this.sorted);
    }
  }

  destroy() {
    super.destroy();
    document.removeEventListener('pointerdown', this.handleDocumentClick);
  }
}


