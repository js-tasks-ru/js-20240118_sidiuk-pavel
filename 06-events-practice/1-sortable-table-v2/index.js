import SortableTableV1 from "../../05-dom-document-loading/2-sortable-table-v1/index.js";


export default class SortableTableV2 extends SortableTableV1 {

  constructor(headersConfig, {
    data = [], sorted = {
      id: headerConfig.find(item => item.sortable).id,
      order: 'asc',
    },
  }) {
    super(headersConfig, data);
    this.createEventListeners();
    this.sorted = sorted;
    this.sorted.id = this.headerConfig.find(item => item.sortable).id;
    this.sorted.order = 'desc';
    this.isSortLocally = true;
  }

  async sortOnClient(id, order) {
    this.data = await this.loadData();
    this.subElements.body.innerHTML = this.createBodyTemplate(this.headerConfig, this.data);
    this.sort(id, order);
  }

  createEventListeners() {
    document.addEventListener('pointerdown', this.handleDocumentClick);
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

  async render(id = this.headerConfig.find((item) => item.sortable).id, order = "desc") {
    if (this.isSortLocally === true) {
      await this.sortOnClient(id, order);
    } else {
      await this.sortOnServer(id, order);
    }
  }

  destroy() {
    super.destroy();
    document.removeEventListener('pointerdown', this.handleDocumentClick);
  }

}


