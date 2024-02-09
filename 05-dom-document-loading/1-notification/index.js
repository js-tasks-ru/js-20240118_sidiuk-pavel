export default class NotificationMessage {
  static lastNotificationMessage;

  constructor(content, {duration = 1000, type = 'success'} = {}) {
    this.content = content;
    this.duration = duration;
    this.type = type;
    this.element = this.createElement(this.createTemplate());
  }

  createElement(template) {
    const element = document.createElement('div');
    element.innerHTML = template;
    return element.firstElementChild;
  }

  createTemplate() {
    return (`
    <div class="notification ${this.type}" style="--value:20s">
       <div class="timer"></div>
       <div class="inner-wrapper">
        <div class="notification-header">${this.type}</div>
        <div class="notification-body">
            ${this.content}
        </div>
       </div>
    </div>
`);
  }

  show(container = document.body) {
    if (NotificationMessage.lastNotificationMessage) {
      NotificationMessage.lastNotificationMessage.destroy();
    }
    NotificationMessage.lastNotificationMessage = this;

    container.appendChild(this.element);

    this.timeoutId = setTimeout(() => {
      this.remove();
    }, this.duration);


  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

  }
}
