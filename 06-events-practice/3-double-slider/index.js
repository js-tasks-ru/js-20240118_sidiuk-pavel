export default class DoubleSlider {
  element;
  subElements = {};
  selected = {};

  constructor({
                min,
                max,
                formatValue = value => '$' + value,
                selected = {
                  from: 100,
                  to: 200,
                }
              } = {}) {
    this.min = min;
    this.max = max;
    this.formatValue = formatValue;
    this.selected = selected || {};
    this.selected.from = this.min !== undefined ? this.min : selected.from;
    this.selected.to = this.max !== undefined ? this.max : selected.to;

    this.element = this.createElement(this.createTemplate());
    this.selectSubElements();
    this.createEventListeners();
  }


  createElement(template) {
    const element = document.createElement('div');
    element.innerHTML = template;
    return element.firstElementChild;

  }

  createTemplate() {
    return `
  <div class="range-slider">
    <span data-element="from">${this.formatValue(this.selected.from)}</span>
    <div class="range-slider__inner">
      <span data-element="progress" class="range-slider__progress" style="left: 0%; right: 0%"></span>
      <span data-element="thumbLeft" class="range-slider__thumb-left" style="left: 0%"></span>
      <span data-element="thumbRight" class="range-slider__thumb-right" style="right: 0%"></span>
    </div>
    <span data-element="to">${this.formatValue(this.selected.to)}</span>
  </div>`;
  }

  selectSubElements() {
    this.element.querySelectorAll('[data-element]').forEach(element => {
      this.subElements[element.dataset.element] = element;
    });
  }

  createEventListeners() {
    document.addEventListener('pointerdown', this.onMouseDown);
    document.addEventListener('pointerup', this.onMouseUp);
    document.addEventListener('pointerout', this.handleDocumentMouseOut);
  }

  destroyEventListeners() {
    document.removeEventListener('pointerdown', this.onMouseDown);
    document.removeEventListener('pointerout', this.handleDocumentMouseOut);
    document.removeEventListener('pointerup', this.onMouseUp);
  }


  onMouseDown = (event) => {
    event.preventDefault();
    let thumbLeft = document.querySelector('.range-slider__thumb-left');
    let thumbRight = document.querySelector('.range-slider__thumb-right');

    if (event.target === thumbLeft) {
      document.addEventListener('pointermove', this.handleDocumentMouseMoveLeft);
    }

    if (event.target === thumbRight) {
      document.addEventListener('pointermove', this.handleDocumentMouseMoveRight);
    }

    thumbLeft.ondragstart = function () {
      return false;
    };
  }

  handleDocumentMouseMoveLeft = (event) => {

    let moveElement = document.querySelector('.range-slider__thumb-left');
    let elemProgress = document.querySelector('.range-slider__progress');
    let progressLength = elemProgress.offsetWidth;
    let targetX = event.clientX;
    let rangeLength = document.querySelector('.range-slider__inner').offsetWidth;
    let marg = document.querySelector('.range-slider__inner').offsetLeft;
    let shiftX = 100 / rangeLength * marg;
    let thumbPosition = 100 / (rangeLength) * targetX;
    let position = thumbPosition - shiftX;
    let currentDroppable = document.querySelector('.range-slider__thumb-right');
    let thumbRightPosition = 100 / rangeLength * currentDroppable.offsetLeft;

    let elemBelow = document.elementFromPoint(event.clientX, event.clientY);
    //let droppableBelow = elemBelow.closest('.range-slider__thumb-right');

    if (!elemBelow) return;


    if (position > thumbRightPosition) {
      position = thumbRightPosition;
    }
    if (position < 0) {
      position = 0;
    }
    if (position > 100) {
      position = 100;
    }
    this.subElements.from.textContent = this.formatValue(Math.round(this.selected.from + position));


    moveElement.style.left = `${position}%`;
    elemProgress.style.left = `${position}%`;


  }

  handleDocumentMouseMoveRight = (event) => {
    let moveElement = document.querySelector('.range-slider__thumb-right');
    let elemProgress = document.querySelector('.range-slider__progress');
    let targetX = event.clientX;
    let rangeLength = document.querySelector('.range-slider__inner').offsetWidth;
    let marg = document.querySelector('.range-slider__inner').offsetLeft;
    let shiftX = 100 / rangeLength * marg;
    let thumbPosition = 100 - (100 / rangeLength * targetX);
    let position = thumbPosition + shiftX;

    let currentDroppable = document.querySelector('.range-slider__thumb-left');
    let thumbLeftPosition = 100 - (100 / rangeLength * currentDroppable.offsetLeft);
    console.log(shiftX);


    if (position > thumbLeftPosition) {
      position = thumbLeftPosition;
    }

    if (position < 0) {
      position = 0;
    }
    if (position > 100) {
      position = 100;
    }
    moveElement.style.right = `${position}%`;
    elemProgress.style.right = `${position}%`;
    this.subElements.to.textContent = this.formatValue(Math.round(this.selected.to - position));
  }

  onMouseUp = (event) => {
    document.removeEventListener('pointermove', this.handleDocumentMouseMoveLeft);
    document.removeEventListener('pointermove', this.handleDocumentMouseMoveRight);
  }

  handleDocumentMouseOut = (event) => {


  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    this.destroyEventListeners();
  }

}
