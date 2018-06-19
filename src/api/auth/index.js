const Router = require('koa-router');
const auth = new Router();
const authCtrl = require('./auth.controller');
const { jwtMiddleware } = require('lib/token');

auth.post('/register', authCtrl.register);
auth.post('/login', authCtrl.login);

auth.use('/check', jwtMiddleware);
auth.get('/check', authCtrl.check);

module.exports = auth;
