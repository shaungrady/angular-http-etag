'use strict';

var angular     = require('angular');
var objectKeys  = require('object-keys');
var queryString = require('query-string');

var provider    = require('./provider');
var interceptor = require('./interceptor');
var config      = require('./config');
var run         = require('./run');

module.exports = angular
  .module('http-etag', [])
  
  .value('objectKeys', objectKeys)
  .value('queryStringify', queryString.stringify)

  .provider('httpEtag', provider)
  .factory('httpEtagInterceptor', interceptor)
  .config(config)
  .run(run)

  .name;
