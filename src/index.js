'use strict';

var angular     = require('angular');
var objectKeys  = require('object-keys');
var arrayMap    = require('array-map');

var provider    = require('./provider');
var interceptor = require('./interceptor');
var config      = require('./config');
var run         = require('./run');

module.exports = angular
  .module('http-etag', [])
  .value('polyfills', {
    keys: objectKeys,
    map: arrayMap
  })
  .provider('httpEtag', provider)
  .factory('httpEtagInterceptor', interceptor)
  .config(config)
  .run(run)

  .name;
