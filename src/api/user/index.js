const Router = require('koa-router');
const user = new Router();
const userCtrl = require('./user.controller');

user.get('/list', userCtrl.list);
user.post('/assign-admin/:username', userCtrl.assignAdmin);

module.exports = user;
