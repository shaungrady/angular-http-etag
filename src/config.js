'use strict';

var angular    = require('angular');
module.exports = httpEtagModuleConfig;

httpEtagModuleConfig.$inject = ['$provide', '$httpProvider'];

function httpEtagModuleConfig ($provide, $httpProvider) {
  $httpProvider.interceptors.push('httpEtagInterceptor');
  // Temporary property for use in run block
  angular.module('http-etag')._$provide = $provide;
}
