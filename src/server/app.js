const Koa = require('koa');

const app = new Koa();

const router = require('./routes');

const views = require('koa-views');
const json = require('koa-json');
const bodyparser = require('koa-bodyparser');
const koaStatic = require('koa-static');
const logger = require('koa-logger');
const path = require('path');
const WebSocket = require('ws');

const port = process.env.PORT || 3000;
const wss = new WebSocket.Server({ port: 1330 });

const startCycle = require('./startCycle');

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    try {
      const parsedMessage = JSON.parse(message);

      if(parsedMessage.type === 'READY') {
        startCycle(ws);
      }

    } catch(e) {
      console.log('error', e);
    }
  }); 
});

app
  .use(json())
  .use(bodyparser())
  .use(logger())
  .use(koaStatic('./public'))
  .use(views('./views', {
    options: { settings: { views: path.join(__dirname, 'views') } },
    map: { ejs: 'ejs' },
    extension: 'ejs',
  }))
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
