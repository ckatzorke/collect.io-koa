/*jslint node: true, nomen: true */

'use strict';

var apikey = require('./apikey');
var gb = require('giantbomb-api')(apikey);
var indexer = require('collect.io-index');

/**
 * search
 */
exports.update = function * () {
    gb.games({
        filter: {
            platforms: 79
        }
    }).then(function (result) {
        indexer.add(result.results);
        var res = yield {
            updated: result.results.length
        };
        this.body = res;
    });
};