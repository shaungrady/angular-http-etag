'use strict'

var angular = require('angular')
var objectKeys = require('object-keys')
var arrayMap = require('array-map')

var _$provide

var service = require('./service')
var $httpDecorator = require('./httpDecorator')
var $httpInterceptor = require('./httpInterceptor')

module.exports = angular
  .module('http-etag', [])
  .value('polyfills', {
    keys: objectKeys,
    map: arrayMap
  })
  .provider('httpEtag', service)
  .config(['$provide', '$httpProvider', function ($provide, $httpProvider) {
    _$provide = $provide
    $httpProvider.interceptors.push($httpInterceptor)
  }])
  .run(function () {
    _$provide.decorator('$http', $httpDecorator)
  })
  .name
