'use strict';

var angular     = require('angular');
var queryString = require('query-string');
var interceptor = require('./interceptor');
var config      = require('./config');

module.exports = angular
  .module('httpEtag', [])
  .value('queryStringify', queryString.stringify)
  .factory('httpEtagInterceptor', interceptor)
  .config(config)
  .name;
