'use strict'

/* eslint-env mocha */

var chai = require('chai')
var spies = require('chai-spies')
chai.use(spies)
var should = chai.should()
var spy = chai.spy

var angular = require('angular')
require('angular-mocks/ngMock')

describe('angular-http-etag', function () {
  /* eslint-disable no-unused-vars */
  var $http, $httpBackend, $cacheFactory, httpEtag, testModule, serverData,
    ifEtagIs, ifEtagIsNot, onCached, onSuccess, onError
  /* eslint-enable no-unused-vars */

  testModule = angular.module('test', ['http-etag']).config(['httpEtagProvider', function (httpEtagProvider) {
    httpEtagProvider
      .defineCache('$cacheFactoryTest', {
        cacheService: '$cacheFactory'
      })
      .defineCache('localStorageTest', {
        cacheService: 'localStorage'
      })
      .defineCache('sessionStorageTest', {
        cacheService: 'sessionStorage'
      })
  }])

  beforeEach(angular.mock.module(require('../')))
  beforeEach(angular.mock.module('test'))

  beforeEach(angular.mock.inject(function ($injector) {
    $http = $injector.get('$http')
    $httpBackend = $injector.get('$httpBackend')
    $cacheFactory = $injector.get('$cacheFactory')
    httpEtag = $injector.get('httpEtag')

    onCached = spy('$http().cached', angular.noop)
    onSuccess = spy('$http().success', angular.noop)
    onError = spy('$http().error', angular.noop)

    ifEtagIs = function (etag) {
      return function (headers) { return headers['If-None-Match'] === etag }
    }

    ifEtagIsNot = function (etag) {
      return function (headers) { return headers['If-None-Match'] !== etag }
    }

    serverData = { id: 1, content: 'Test data' }

    $httpBackend
      .whenGET('/1.json', ifEtagIsNot('1'))
      .respond(serverData, { 'etag': '1' })
    $httpBackend
      .whenGET('/1.json', ifEtagIs('1'))
      .respond(304)

    $httpBackend
      .whenGET('/1', ifEtagIsNot('1'))
      .respond(serverData, { 'etag': '1' })
    $httpBackend
      .whenGET('/1', ifEtagIs('1'))
      .respond(304)

    $httpBackend
      .whenGET('/1.json?x=1&y=2&y=3', ifEtagIsNot('1'))
      .respond(serverData, { 'etag': '1' })
    $httpBackend
      .whenGET('/1.json?x=1&y=2&y=3', ifEtagIs('1'))
      .respond(304)
  }))

  it('Adapters should work', function () {
    var testValue = [{ hi: true, mom: [{ 1: '😍' }] }]

    var cachesIds = [
      '$cacheFactoryTest',
      'localStorageTest',
      'sessionStorageTest'
    ]

    cachesIds.forEach(function (cacheId) {
      var cache = httpEtag.getCache(cacheId)

      cache.setItem('test', testValue)
      cache.getItem('test').should.deep.equal(testValue)
      cache.removeItem('test')
      should.not.exist(cache.getItem('test'))
      cache.setItem('test1', testValue)
      cache.setItem('test2', testValue)
      cache.removeAllItems()
      should.not.exist(cache.getItem('test1'))
      should.not.exist(cache.getItem('test2'))

      var itemCache = cache.getItemCache('test')

      itemCache.set(testValue)
      itemCache.get('test').should.deep.equal(testValue)
      itemCache.remove('test')
      should.not.exist(itemCache.get('test'))
    })
  })

  it('Decorator/Interceptor should work', function () {
    $http.get('/1.json', { etag: true })
      .cached(onCached)
      .success(onSuccess)
    $httpBackend.flush()

    $http.get('/1.json', { etag: true })
      .cached(onCached)
      .error(onError)
    $httpBackend.flush()

    onCached.should.have.been.called.once
    onSuccess.should.have.been.called.once
    onError.should.have.been.called.once
  })
})
