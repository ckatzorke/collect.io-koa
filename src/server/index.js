/*jslint node: true, nomen: true , esnext: true */

var koa = require('koa');
var app = koa();
var route = require('koa-route');
var logger = require('koa-logger');
var compress = require('koa-compress');
var responseTime = require('koa-response-time');
var gbhandler = require('./src/server/gb-handler.js');


var compressOpts = {
    filter: function (contentType) {
        'use strict';
        return /text/i.test(contentType) || /application\/json/i.test(contentType) || /application\/xml/i.test(contentType);
    }, // filter requests to be compressed using regex 
    threshold: 2048, //minimum size to compress
    flush: require('zlib').Z_SYNC_FLUSH
};
app.use(compress(compressOpts));

//response time
app.use(responseTime());

//error handler
app.use(function * (next) {
    'use strict';
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
//logger
app.use(logger());

//games rest service
app.use(route.get('/search', gbhandler.search));
app.use(route.get('/detail/:id', gbhandler.detail));

if (!module.parent) {
    app.listen(3000);
}
console.log('GB-koa is running on http://localhost:3000/');