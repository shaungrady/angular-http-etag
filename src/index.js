'use strict'

var angular = require('angular')

var service = require('./service')
var $httpDecorator = require('./httpDecorator')
var $httpInterceptor = require('./httpInterceptor')
var cacheServiceAdapters = require('./cacheServiceAdapters')

var _$provide

module.exports = angular
  .module('http-etag', [])
  .provider('httpEtag', service)
  .config(cacheServiceAdapters)
  .config(['$provide', '$httpProvider', function ($provide, $httpProvider) {
    _$provide = $provide
    $httpProvider.interceptors.push($httpInterceptor)
  }])
  .run(function () {
    _$provide.decorator('$http', $httpDecorator)
  })
  .name
