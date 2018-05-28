import { debounce } from './helpers';

/**
 * Controller - Базовый класс контроллера
 *
 * @param  {instance} model Инстанс модели
 * @param  {instance} view  Инстанс вью
 */
export default class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.onSearch = debounce(this.onSearch.bind(this), 250);

    this.initListerens();
    this.init();
  }

  init() {
    const users = this.model.read('users');
    this.view.init(users.length);
    this.fetchUsers();
    this.initWS();
  }

  initWS() {
    const ws = new WebSocket('ws://localhost:1330');

    ws.onopen = (e) => {
      console.log(e, 'WS channel has oppened');
      ws.send(JSON.stringify({type: 'READY'}));
    }

    ws.onmessage = (e) => {
      const message = JSON.parse(e.data);

      if(message.type === 'PREPARE') {
        this.model.update('users', []);
        this.view.toggleLoader(true);
        return;
      }

      if(message.type === 'NEW_USERS') {
        this.model.update('users', message.data);
        this.view.toggleLoader(false);
        return;
      }
    }
  }

  fetchUsers() {
    this.view.toggleLoader(true);
    fetch('/api/users')
      .then(res => res.json())
      .then(users => this.model.update('users', users))
      .catch(() => {
        this.view.toggleLoader(false);
        this.view.toggleError(true);
      });
  }

  onSearch({ target: { value } }) {
    if (!value.length) {
      this.view.filter(this.model
        .read('users')
        .map(user => user.id));
      return;
    }

    const filtered = this.model
      .searchBy({
        modelField: 'users',
        searchField: 'name',
        value,
      })
      .map(user => user.id);

    this.view.filter(filtered);
    this.view.updateCounter(filtered.length);
  }

  initListerens() {
    this.model.on('updated', (users) => {
      this.view.onUpdateList(users.length);
      this.view.createUserList(users);
    });

    this.view.on('tryAgain', () => {
      this.fetchUsers();
    });

    this.view.on('search', this.onSearch);
  }
}
