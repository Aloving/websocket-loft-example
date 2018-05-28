import { EventEmitter, createElement } from './helpers';

/**
 * View - Базовый класс вью
 */
/* eslint class-methods-use-this: ["error", { "exceptMethods": ["visabilityToggler"] }] */
export default class View extends EventEmitter {
  constructor() {
    super();

    this.userElements = [];

    this.search = document.querySelector('.search');
    this.userContainer = document.querySelector('.user-container');
    this.counter = document.querySelector('.counter');
    this.loader = document.querySelector('.my-loader');
    this.errorBlock = document.querySelector('.error-block');
    this.tryAgain = document.querySelector('.try-again');
    this.notFound = document.querySelector('.not-found');

    this.initListeners();
  }

  initListeners() {
    this.tryAgain.addEventListener('click', () => {
      this.emit('tryAgain');
    });

    this.search.addEventListener('keydown', e => this.emit('search', e));
  }

  init(usersCount) {
    this.toggleLoader(true);
    this.onUpdateList(usersCount);
  }

  onUpdateList(usersCount) {
    this.updateCounter(usersCount);
    this.toggleSearch(!usersCount);
    this.toggleLoader(!usersCount);
  }

  toggleLoader(condition) {
    this.visabilityToggler(this.loader, condition);

    if (condition) {
      this.visabilityToggler(this.errorBlock, false);
      this.visabilityToggler(this.notFound, false);
    }
  }

  toggleNotFound(condition) {
    this.visabilityToggler(this.notFound, condition);
  }

  toggleError(condition) {
    this.visabilityToggler(this.errorBlock, condition);
  }

  updateCounter(count) {
    this.counter.innerText = count;
  }

  toggleSearch(condition) {
    this.search.disabled = condition;
  }

  createUserList(users) {
  	this.userContainer.innerHTML = '';
    const fragment = document.createDocumentFragment();
    users.forEach((user) => {
      const avatarImage = createElement('img', {
        src: user.img,
      });

      const nameTag = createElement('p', {}, user.name);

      const avatarElement = createElement(
        'div',
        {
          className: 'avatar',
        },
        avatarImage,
      );

      const userElement = createElement(
        'div',
        {
          className: 'panel-block',
          id: user.id,
        },
        avatarElement,
        nameTag,
      );

      this.userElements.push(userElement);
      fragment.appendChild(userElement);
    });
    this.userContainer.appendChild(fragment);
  }

  visabilityToggler(element, condition) {
    if (condition) {
      element.classList.remove('display_none');
      return;
    }

    element.classList.add('display_none');
  }

  filter(data) {
    this.toggleNotFound(false);

    const forHide = this.userElements.filter(item => !data.includes(+item.id));
    const forDisplay = this.userElements.filter(item => data.includes(+item.id));

    forHide.forEach((item) => {
      item.classList.add('display_none');
    });

    forDisplay.forEach((item) => {
      item.classList.remove('display_none');
    });

    this.updateCounter(data.length);

    if (!data.length) {
      this.toggleNotFound(true);
    }
  }
}
