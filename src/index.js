'use strict'

import service from './service'
import httpDecorator from './httpDecorator'
import httpInterceptor from './httpInterceptor'
import cacheServiceAdapters from './cacheServiceAdapters'

import angular from 'angular'
var _$provide

module.exports = angular
  .module('http-etag', [])
  .provider('httpEtag', service)
  .config(cacheServiceAdapters)
  .config(['$provide', '$httpProvider', function addHttpEtagInterceptor ($provide, $httpProvider) {
    _$provide = $provide
    $httpProvider.interceptors.push(httpInterceptor)
  }])
  .run(function decorateHttpService () {
    _$provide.decorator('$http', httpDecorator)
  })
  .name
