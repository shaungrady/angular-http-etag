'use strict'

var chai = require('chai')
var spies = require('chai-spies'); chai.use(spies)
var expect = chai.expect
var should = chai.should()
var spy = chai.spy

var httpEtagProvider
var httpEtag
var $http
var $httpBackend

var cachedSpy
var ifCachedSpy
var successSpy
var errorSpy

// Helpers

var mockResponseData = {
  id: 1,
  error: false,
  content: 'Hello friend!'
}

var mockParams = {
  hello: 'world',
  i: ['think', 'am']
}

function isEtag (etag) { return function (headers) { return headers['If-None-Match'] === etag } }
function isNotEtag (etag) { return function (headers) { return headers['If-None-Match'] !== etag } }

// On to the tests

describe('HTTP Decorator', function () {
  beforeEach(function () {
    angular
      .module('test', ['http-etag'])
      .config(['httpEtagProvider', '$qProvider', function (_httpEtagProvider_, $qProvider) {
        $qProvider.errorOnUnhandledRejections(false)
        httpEtagProvider = _httpEtagProvider_

        httpEtagProvider
          .defineCache('testCache')
          .defineCache('cacheResponseDataFalseTestCache', {
            cacheResponseData: false
          })
      }])

    angular.mock.module('test')
    angular.mock.inject(function ($injector) {
      httpEtag = $injector.get('httpEtag')
      $http = $injector.get('$http')
      $httpBackend = $injector.get('$httpBackend')

      cachedSpy = spy('cached', angular.noop)
      ifCachedSpy = spy('ifCached', angular.noop)
      successSpy = spy('success', angular.noop)
      errorSpy = spy('error', angular.noop)

      // Setup backend mocks
      $httpBackend
        .whenGET('/1.json', isNotEtag('1000'))
        .respond(mockResponseData, { etag: '1000' })

      $httpBackend
        .whenGET('/1.json', isEtag('1000'))
        .respond(304)

      // With params this time
      $httpBackend
        .whenGET('/1.json?hello=world&i=think&i=am', isNotEtag('2000'))
        .respond(mockResponseData, { etag: '2000' })

      $httpBackend
        .whenGET('/1.json?hello=world&i=think&i=am', isEtag('2000'))
        .respond(304)

      // Server that doesn't respond with ETags
      $httpBackend
        .whenGET('/404.json')
        .respond(mockResponseData)
    })
  })

  it('should have same properties/methods as undecorated $http service', function () {
    var properties = [
      ['delete', 'function'],
      ['get', 'function'],
      ['head', 'function'],
      ['jsonp', 'function'],
      ['patch', 'function'],
      ['post', 'function'],
      ['put', 'function'],
      ['defaults', 'object'],
      ['pendingRequests', 'object']
    ]

    angular.forEach(properties, function (tuple) {
      var method = tuple[0]
      var expectedType = tuple[1]
      var type = typeof $http[method]
      type.should.equal(expectedType)
    })
  })

  it('should cache response and ETag data', function () {
    $http.get('/1.json', { etagCache: true })
      .ifCached(cachedSpy)
      .then(successSpy)
    $httpBackend.flush()

    cachedSpy.should.have.not.been.called
    successSpy.should.have.been.called.once

    $http.get('/1.json', { etagCache: true })
      .ifCached(cachedSpy)
      .then(successSpy, errorSpy)
    $httpBackend.flush()

    cachedSpy.should.have.been.called.once
    successSpy.should.have.been.called.once
    errorSpy.should.have.been.called.once
  })

  it('should not let cached ETag get wiped by modifying cache data', function () {
    $http.get('/1.json', { etagCache: true })
    $httpBackend.flush()

    $http.get('/1.json', { etagCache: true })
      .ifCached(function (response, itemCache) {
        itemCache.unset()
      })
    $httpBackend.flush()

    $http.get('/1.json', { etagCache: true })
      .ifCached(cachedSpy)
    $httpBackend.flush()

    cachedSpy.should.have.been.called.once
  })

  it('should use a different itemKey for requests with params', function () {
    $http.get('/1.json', { etagCache: true })
      .ifCached(cachedSpy)
      .then(successSpy)
    $httpBackend.flush()

    $http
      .get('/1.json', {
        etagCache: true,
        params: mockParams
      })
      .ifCached(cachedSpy)
      .then(successSpy)
    $httpBackend.flush()

    successSpy.should.have.been.called.twice

    $http
      .get('/1.json', {
        etagCache: true,
        params: mockParams
      })
      .ifCached(cachedSpy)
      .then(successSpy, errorSpy)
    $httpBackend.flush()

    successSpy.should.have.been.called.twice
    cachedSpy.should.have.been.called.once
    errorSpy.should.have.been.called.once
  })

  it('should call `cached` callback with proper arguments', function () {
    var httpConfig = {
      method: 'GET',
      url: '/1.json',
      etagCache: true
    }

    $http(httpConfig)
      .ifCached(cachedSpy)
      .then(successSpy)
    $httpBackend.flush()

    $http(httpConfig)
      .ifCached(function (response, itemCache) {
        response.data.should.deep.equal(mockResponseData)
        response.status.should.equal('cached')
        should.not.exist(response.headers)
        response.config.method.should.equal(httpConfig.method)
        response.config.url.should.equal(httpConfig.url)
        response.config.etagCache.should.equal(httpConfig.etagCache)
        var cacheInfo = itemCache.info()
        cacheInfo.id.should.equal('httpEtagCache')
      })
      .catch(errorSpy)
    $httpBackend.flush()
  })

  it('should call `ifCached` callback with proper arguments', function () {
    var httpConfig = {
      method: 'GET',
      url: '/1.json',
      etagCache: true
    }

    $http(httpConfig)
      .ifCached(ifCachedSpy)
      .then(successSpy)
    $httpBackend.flush()

    $http(httpConfig)
      .ifCached(function (response, itemCache) {
        response.data.should.deep.equal(mockResponseData)
        response.status.should.equal('cached')
        should.not.exist(response.headers)
        response.config.method.should.equal(httpConfig.method)
        response.config.url.should.equal(httpConfig.url)
        response.config.etagCache.should.equal(httpConfig.etagCache)
        var cacheInfo = itemCache.info()
        cacheInfo.id.should.equal('httpEtagCache')
      })
      .catch(errorSpy)
    $httpBackend.flush()
  })

  it('should call `success` callback with proper arguments', function () {
    var httpConfig = {
      method: 'GET',
      url: '/1.json',
      etagCache: true
    }

    $http(httpConfig)
      .then(function (response, itemCache) {
        response.data.should.deep.equal(mockResponseData)
        expect(response.status).to.equal(200)
        response.headers.should.be.a('function')
        response.config.method.should.equal(httpConfig.method)
        response.config.url.should.equal(httpConfig.url)
        response.config.etagCache.should.equal(httpConfig.etagCache)
        var cacheInfo = itemCache.info()
        cacheInfo.id.should.equal('httpEtagCache')
      })
    $httpBackend.flush()
  })

  it('should wrap `then` callback properly', function () {
    var httpConfig = {
      method: 'GET',
      url: '/1.json',
      etagCache: true
    }
    var promise = $http(httpConfig)

    promise.ifCached.should.be.a('function')

    promise
      .then(function (response, itemCache) {
        var data = response.data
        var status = response.status
        var headers = response.headers
        var config = response.config

        data.should.deep.equal(mockResponseData)
        expect(status).to.equal(200)
        headers.should.be.a('function')
        config.method.should.equal(httpConfig.method)
        config.url.should.equal(httpConfig.url)
        config.etagCache.should.equal(httpConfig.etagCache)
        var cacheInfo = itemCache.info()
        cacheInfo.id.should.equal('httpEtagCache')
      })
    $httpBackend.flush()
  })

  it('should wrap promise returned by `then`', function () {
    var httpConfig = {
      method: 'GET',
      url: '/1.json',
      etagCache: true
    }

    var thenPromise = $http(httpConfig).then()

    thenPromise.ifCached.should.be.a('function')

    thenPromise
      .then(function (response, itemCache) {
        var data = response.data
        var status = response.status
        var headers = response.headers
        var config = response.config

        data.should.deep.equal(mockResponseData)
        expect(status).to.equal(200)
        headers.should.be.a('function')
        config.method.should.equal(httpConfig.method)
        config.url.should.equal(httpConfig.url)
        config.etagCache.should.equal(httpConfig.etagCache)
        var cacheInfo = itemCache.info()
        cacheInfo.id.should.equal('httpEtagCache')
      })
    $httpBackend.flush()
  })

  it('should use the default cacheId with `{ etagCache: true }`', function () {
    $http.get('/1.json', { etagCache: true })
    $httpBackend.flush()

    $http.get('/1.json', { etagCache: true })
      .ifCached(function (response, itemCache) {
        var cacheInfo = itemCache.info()
        cacheInfo.id.should.equal('httpEtagCache')
      })
    $httpBackend.flush()
  })

  it('should accept a string specifying desired cacheId', function () {
    $http.get('/1.json', { etagCache: 'testCache' })
    $httpBackend.flush()

    $http.get('/1.json', { etagCache: 'testCache' })
      .ifCached(function (response, itemCache) {
        var cacheInfo = itemCache.info()
        cacheInfo.id.should.equal('testCache')
      })
    $httpBackend.flush()
  })

  it('should accept an object specifying desired cacheId', function () {
    var cacheConfig = {
      id: 'testCache'
    }

    $http.get('/1.json', { etagCache: cacheConfig })
    $httpBackend.flush()

    $http.get('/1.json', { etagCache: cacheConfig })
      .ifCached(function (response, itemCache) {
        var cacheInfo = itemCache.info()
        cacheInfo.id.should.equal('testCache')
      })
    $httpBackend.flush()
  })

  it('should accept an object specifying desired cacheId and itemKey', function () {
    var cacheConfig = {
      id: 'testCache',
      itemKey: 'testItemKey'
    }

    $http.get('/1.json', { etagCache: cacheConfig })
    $httpBackend.flush()

    $http.get('/1.json', { etagCache: cacheConfig })
      .ifCached(function (response, itemCache) {
        var cacheInfo = itemCache.info()
        cacheInfo.id.should.equal('testCache')
        cacheInfo.itemKey.should.equal('testItemKey')
      })
    $httpBackend.flush()
  })

  it('should accept a cache object', function () {
    var cache = httpEtag.getCache('testCache')

    $http.get('/1.json', { etagCache: cache })
    $httpBackend.flush()

    $http.get('/1.json', { etagCache: cache })
      .ifCached(function (response, itemCache) {
        var cacheInfo = itemCache.info()
        cacheInfo.id.should.equal('testCache')
        cacheInfo.itemKey.should.equal('/1.json')
      })
    $httpBackend.flush()
  })

  it('should accept an itemCache object', function () {
    var itemCache = httpEtag.getItemCache('testCache', 'testItemKey')

    $http.get('/1.json', { etagCache: itemCache })
    $httpBackend.flush()

    $http.get('/1.json', { etagCache: itemCache })
      .ifCached(function (response, itemCache) {
        var cacheInfo = itemCache.info()
        cacheInfo.id.should.equal('testCache')
        cacheInfo.itemKey.should.equal('testItemKey')
      })
    $httpBackend.flush()
  })

  it('should accept a function returning desired cacheId', function () {
    var cacheConfig = {
      id: 'testCache'
    }

    var getCacheConfig = function (httpConfig) {
      httpConfig.should.be.an('object')
      httpConfig.method.should.equal('GET')
      httpConfig.url.should.equal('/1.json')
      return cacheConfig
    }

    $http.get('/1.json', { etagCache: getCacheConfig })
    $httpBackend.flush()

    $http.get('/1.json', { etagCache: getCacheConfig })
      .ifCached(function (response, itemCache) {
        var cacheInfo = itemCache.info()
        cacheInfo.id.should.equal('testCache')
        should.exist(cacheInfo.itemKey)
      })
    $httpBackend.flush()
  })

  it('should accept a function returning desired cacheId and itemKey', function () {
    var cacheConfig = {
      id: 'testCache',
      itemKey: 'testItemKey'
    }
    var getCacheConfig = function (httpConfig) {
      return cacheConfig
    }

    $http.get('/1.json', { etagCache: getCacheConfig })
    $httpBackend.flush()

    $http.get('/1.json', { etagCache: getCacheConfig })
      .ifCached(function (response, itemCache) {
        var cacheInfo = itemCache.info()
        cacheInfo.id.should.equal('testCache')
        cacheInfo.itemKey.should.equal('testItemKey')
      })
    $httpBackend.flush()
  })

  it('should accept a function returning undefined/false to disable cache', function () {
    $http.get('/1.json', { etagCache: angular.noop })
    $httpBackend.flush()

    $http.get('/1.json', { etagCache: angular.noop })
      .ifCached(cachedSpy)
      .then(successSpy)
    $httpBackend.flush()

    cachedSpy.should.not.have.been.called
    successSpy.should.have.been.called
  })

  it('should throw an error when specifying a bad cache ID', function () {
    function badCacheIdRequest () {
      $http.get('/1.json', { etagCache: 'Undefined Cache' })
    }

    badCacheIdRequest.should.throw(Error)
  })

  it('should not cache when etagCache property value is false', function () {
    $http.get('/1.json', { etagCache: false })
    $httpBackend.flush()

    $http.get('/1.json', { etagCache: false })
      .ifCached(cachedSpy)
      .then(successSpy)
    $httpBackend.flush()

    cachedSpy.should.not.have.been.called
    successSpy.should.have.been.called
  })

  it('should not cache response data when cache is configured not to', function () {
    $http.get('/1.json', { etagCache: 'cacheResponseDataFalseTestCache' })
    $httpBackend.flush()

    $http.get('/1.json', { etagCache: 'cacheResponseDataFalseTestCache' })
      .ifCached(cachedSpy)
    $httpBackend.flush()

    cachedSpy.should.not.have.been.called
  })

  it('should gracefully handle a response without an ETag header', function () {
    $http.get('/404.json', { etagCache: true })
      .ifCached(cachedSpy)
      .then(successSpy, errorSpy)
    $httpBackend.flush()

    cachedSpy.should.not.have.been.called
    successSpy.should.have.been.called
    errorSpy.should.not.have.been.called

    $http.get('/404.json', { etagCache: true })
      .ifCached(cachedSpy)
      .then(successSpy, errorSpy)
    $httpBackend.flush()

    cachedSpy.should.not.have.been.called
    successSpy.should.have.been.called.twice
    errorSpy.should.not.have.been.called
  })
})
