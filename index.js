var koa = require('koa');
var app = koa();
var router = require('koa-router');
var mount = require('koa-mount');
var gbhandler = require('./src/handler/gb-handler.js');
 
var gb = new router();
gb.get('/search', gbhandler.search);
gb.get('/detail', gbhandler.detail);
 
 
app.use(mount('/gb', gb.middleware()));
if (!module.parent) app.listen(3000);
console.log('GB-koa is running on http://localhost:3000/');