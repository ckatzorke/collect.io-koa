/*jslint node: true, nomen: true */

'use strict';

var apikey = require('./apikey');
var gb = require('giantbomb-api')(apikey);
/**
 * search
 */
exports.search = function *() {
    if (this.request.query.q) {
        var res = yield gb.search(this.request.query.q);
        this.body = res;
    } else {
        this.response.status = 404;
    }
};
/**
 * derails
 */
exports.detail = function *() {
    if (this.request.query.id) {
        var res = yield gb.detail(this.request.query.id);
        this.body = res;
    } else {
        this.response.status = 404;
    }
};