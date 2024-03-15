import fetchJson from "../2-sortable-table-v3/utils/fetch-json.js";
import ColumnChartV1 from "../../04-oop-basic-intro-to-dom/1-column-chart/index.js";

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChart extends ColumnChartV1 {
  subElements = {};

  constructor({data, url = '', label = '', link = '', range = {}} = {}) {
    super({data, label, link});
    this.url = url;
    this.subElements = this.getSubElements();
    this.update(range?.from, range?.to);
    this.createEventListeners();

  }

  createRequestURL() {
    const url = new URL(this.url, BACKEND_URL);
    return url;
  }

  getSubElements() {
    const elements = this.element.querySelectorAll("[data-element]");

    const accumulateSubElements = (subElements, currentElement) => {
      subElements[currentElement.dataset.element] = currentElement;

      return subElements;
    };

    return [...elements].reduce(accumulateSubElements, {});
  }

  async loadData(from, to) {
    const url = this.createRequestURL();
    url.searchParams.set("from", from);
    url.searchParams.set("to", to);
    return await fetchJson(url);
  }

  createEventListeners() {
    document.addEventListener('pointerdown', this.handleDocumentClick);
  }

  async update(from, to) {
    this.showLoader(true);

    const data = await this.loadData(from, to);

    if (Object.keys(data).length) {
      this.data = Object.entries(data).map(([date, value]) => value);
      this.value = this.data.length;

      this.updateHeader();
      this.updateBody();
      this.showLoader(false);
    }

    return data;
  }

  updateHeader() {
    this.subElements.header.innerHTML = this.value;
  }

  updateBody() {
    this.subElements.body.innerHTML = this.createChartBodyTemplate();
  }

  showLoader(status = true) {
    const element = this.element;

    if (status) {
      element.classList.add("column-chart_loading");
    } else {
      element.classList.remove("column-chart_loading");
    }
  }

}
