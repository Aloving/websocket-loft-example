const users = require('./users');
const _ = require('lodash')

const randomArray = (arr) => {
  const randomArrayLength = Math.random() * arr.length;

  return _.drop(arr, randomArrayLength);
};

function sendPrepareState(ws) {
  ws.send(JSON.stringify({
    type: 'PREPARE'
  }));
};

function sendUsers(ws) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
       ws.send(JSON.stringify({
        type: 'NEW_USERS',
        data: randomArray(users)
      }))
      return resolve();
    }, 1500);
  });
}

module.exports = function(ws) {
  setInterval(async () => {
    sendPrepareState(ws);
    try {
      const users = await sendUsers(ws);
    } catch(e) {
      console.log('error')
    }
  }, 5500);
}