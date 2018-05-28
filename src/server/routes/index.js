const Router = require('koa-router');

const router = new Router();

const users = require('../users');

// render index page
router.get('/', async (ctx) => {
	ctx.search = '?lul=lel'
  await ctx.render('index');
});

router.get('/api/users', async (ctx) => {
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() <= 1) {
        resolve(users);
        return;
      }

      reject();
    }, 2000);
  });

  try {
    ctx.body = await promise;
  } catch (e) {
    ctx.throw(400, 'error');
  }
});

module.exports = router;
