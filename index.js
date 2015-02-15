var koa = require('koa');
var app = koa();
var router = require('koa-router');
var mount = require('koa-mount');
var logger = require('koa-logger');
var compress = require('koa-compress');
var responseTime = require('koa-response-time');
var limit = require('koa-better-ratelimit');
var gbhandler = require('./src/handler/gb-handler.js');

var compressOpts = {
    filter: function (content_type) {
        return /text/i.test(content_type) || /application\/json/i.test(content_type) || /application\/xml/i.test(content_type);
    }, // filter requests to be compressed using regex 
    threshold: 2048, //minimum size to compress
    flush: require('zlib').Z_SYNC_FLUSH
};
app.use(compress(compressOpts));

//response time
app.use(responseTime());

//error handler
app.use(function * (next) {
    try {
        yield next;
    } catch (err) {
        this.type = 'json';
        this.status = err.status || 500;
        this.body = {
            'error': 'Ooopsie.'
        };
        //delegate the error back to application
        this.app.emit('error', err, this);
    }
});
//limit
app.use(limit({
    duration: 1000 * 60 * 3, // 3 min
    max: 10,
    blacklist: []
}));
//logger
app.use(logger());

//games rest service
var gb = new router();
gb.get('/search', gbhandler.search);
gb.get('/detail', gbhandler.detail);
app.use(mount('/gb', gb.middleware()));
if (!module.parent) app.listen(3000);
console.log('GB-koa is running on http://localhost:3000/');