export default class DoubleSlider {
  element;
  container;
  thumbLeft;
  thumbRight;

  constructor() {
    this.element = this.createElement(this.createTemplate());
    this.container = document.querySelector('.range-slider');
    // this.thumbLeft = document.querySelector('.range-slider__thumb-left');
    // this.thumbRight = document.querySelector('.range-slider__thumb-right');
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
    <span>$30</span>
    <div class="range-slider__inner">
      <span class="range-slider__progress" style="left: 0%; right: 0%"></span>
      <span class="range-slider__thumb-left" style="left: 0%"></span>
      <span class="range-slider__thumb-right" style="right: 0%"></span>
    </div>
    <span>$70</span>
  </div>`;
  }

  createEventListeners() {
    document.addEventListener('mousedown', this.onMouseDown);
    document.addEventListener('mouseup', this.onMouseUp);
    document.addEventListener('pointerout', this.handleDocumentMouseOut);
  }

  destroyEventListeners() {
    document.removeEventListener('mousedown', this.onMouseDown);
    document.removeEventListener('pointerout', this.handleDocumentMouseOut);
    document.removeEventListener('mouseup', this.onMouseUp);
  }


  onMouseDown = (event) => {
    event.preventDefault();
    let thumbLeft = document.querySelector('.range-slider__thumb-left');
    let thumbRight = document.querySelector('.range-slider__thumb-right');

    if (event.target === thumbLeft) {
      document.addEventListener('mousemove', this.handleDocumentMouseMoveLeft);
    }

    if (event.target === thumbRight) {
      document.addEventListener('mousemove', this.handleDocumentMouseMoveRight);
    }

    thumbLeft.ondragstart = function () {
      return false;
    };
  }

  handleDocumentMouseMoveLeft = (event) => {

    let moveElement = document.querySelector('.range-slider__thumb-left');
    let elemProgress = document.querySelector('.range-slider__progress');
    let targetX = event.clientX;
    let rangeLength = document.querySelector('.range-slider__inner').offsetWidth;
    let marg = document.querySelector('.range-slider__inner').offsetLeft;
    let shiftX = 100 / rangeLength * marg;
    let thumbPosition = 100 / (rangeLength) * targetX;
    let position = thumbPosition - shiftX;
    let currentDroppable = null;
    moveElement.hidden = true;

    moveElement.hidden = false;


    let elemBelow = document.elementFromPoint(event.clientX, event.clientY);
    let droppableBelow = elemBelow.closest('.range-slider__thumb-right');
    if (!elemBelow) return;


    if (position < 0) {
      position = 0;
    }
    if (position > 100) {
      position = 100;
    }


    moveElement.style.left = `${position}%`;
    elemProgress.style.left = `${position}%`;

    if (droppableBelow !== currentDroppable) {
      document.removeEventListener('mousemove', this.handleDocumentMouseMoveLeft);
    }

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
    if (position < 0) {
      position = 0;
    }
    if (position > 100) {
      position = 100;
    }
    moveElement.style.right = `${position}%`;
    elemProgress.style.right = `${position}%`;
  }

  onMouseUp = (event) => {
    document.removeEventListener('mousemove', this.handleDocumentMouseMoveLeft);
    document.removeEventListener('mousemove', this.handleDocumentMouseMoveRight);
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
