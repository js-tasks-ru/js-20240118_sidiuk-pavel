class Tooltip {
  element;

  static OFFSET_TOP = 10;
  static OFFSET_LEFT = 10;

  static instance;

  constructor() {
    if (Tooltip.instance) {
      return Tooltip.instance;
    }
    Tooltip.instance = this;
  }

  initialize() {
    this.element = this.createElement(this.createTemplate());
    this.createEventListeners();
  }

  createElement(template) {
    const element = document.createElement('div');
    element.innerHTML = template;
    return element.firstElementChild;
  }

  createTemplate() {
    return `<div class="tooltip"></div>`;
  }

  createEventListeners() {
    document.addEventListener('pointerover', this.handleDocumentPointerover);
    document.addEventListener('pointerout', this.handleDocumentPointerout);
  }

  destroyEventListeners() {
    document.removeEventListener('pointerover', this.handleDocumentPointerover);
    document.addEventListener('pointerout', this.handleDocumentPointerout);
  }

  handleDocumentPointerover = (event) => {
    if (event.target.dataset.tooltip) {
      this.element.style.top = `${event.clientY + Tooltip.OFFSET_TOP}px`;
      this.element.style.left = `${event.clientX + Tooltip.OFFSET_LEFT}px`;
      this.render(event.target.dataset.tooltip);
    }
  }

  handleDocumentPointerout = (event) => {
    if (event.target.dataset.tooltip) {
      this.remove();
    }
  }

  render(content) {
    this.element.textContent = content;

    document.body.appendChild(this.element);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    this.destroyEventListeners();
  }
}

export default Tooltip;
