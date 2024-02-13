class Tooltip {
  element;
  static lastTooltipElement;

  initialize() {

    this.body = document.querySelector('body');
    this.element = this.createElement(this.createTemplate());
    this.createEventListeners();
    if (Tooltip.lastTooltipElement) {
      Tooltip.lastTooltipElement.destroy();
    }
    Tooltip.lastTooltipElement = this;

  }

  createEventListeners() {
    this.body.addEventListener('pointerover', this.pointeroverEvent);
  }
  destroyEventListeners() {
    this.body.removeEventListener('pointerover', this.pointeroverEvent);
  }
  pointeroverEvent = () => {
    this.body.addEventListener('pointerover', (event) =>{
      if (event.target.dataset.tooltip) {
        this.element.innerText = event.target.dataset.tooltip;
        this.element.style.top = `${event.clientY}px`;
        this.element.style.left = `${event.clientX}px`;
        this.render();
      }
    });

  }

  createElement(template) {
    const element = document.createElement('div');
    element.innerHTML = template;
    return element.firstElementChild;
  }

  createTemplate() {
    return `<div class="tooltip"></div>`;
  }

  render() {



    this.body.appendChild(this.element);

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
