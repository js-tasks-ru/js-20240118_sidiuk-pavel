import SortableTableV2 from "../../06-events-practice/1-sortable-table-v2/index.js";
import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';
const ITEMS_PER_REQUEST = 20;
export default class SortableTable extends SortableTableV2 {
  pagination = {};

  constructor(headersConfig, {
    data = [], sorted = {}, url = ''
  } = {}) {
    super(headersConfig, {data, sorted});
    this.url = url;
    this.isSortLocally = false;
    this.pagination.start = 1;
    this.pagination.end = ITEMS_PER_REQUEST + this.pagination.start;
    this.createEventListeners();
    this.render();
  }

  createRequestURL(id, order) {
    const url = new URL(this.url, BACKEND_URL);
    /*
      Запросы на сервер: Все параметры API можно получить на странице демо-версии проекта https://course-js.javascript.ru/ проинспектировав «сетевые запросы» (в «Google Chrome» это вкладка «Network» в консоли разработчика)
    */
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

  async loadData(id, order) {
    const url = this.createRequestURL(id, order);
    this.showLoader(true);
    const data = await fetchJson(url);
    this.showLoader(false);
    return data;
  }

  showLoader(status) {
    const {loading} = this.subElements;
    loading.style.display = status === true ? "block" : "none";
  }

  async sortOnClient(id, order) {
    super.sortOnClient(id, order);
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
    super.createEventListeners();
    window.addEventListener("scroll", this.handleBodyScroll);
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

  async render(id = 'title', order = "asc") {
    super.render(id, order);

  }

  destroy() {
    super.destroy();
    window.removeEventListener("scroll", this.handleBodyScroll);
  }
}
