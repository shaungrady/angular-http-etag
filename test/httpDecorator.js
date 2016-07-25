'use strict'

var angular = require('angular')
var chai = require('chai')
var spies = require('chai-spies'); chai.use(spies)
var should = chai.should()
var spy = chai.spy

var httpEtagProvider
// var httpEtag
var $http
var $httpBackend

var cachedSpy
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

beforeEach(function () {
  angular
    .module('test', ['http-etag'])
    .config(['httpEtagProvider', function (__httpEtagProvider) {
      httpEtagProvider = __httpEtagProvider
      httpEtagProvider
        .defineCache('testCache')
        .defineCache('cacheResponseDataFalseTestCache', {
          cacheResponseData: false
        })
    }])

  angular.mock.module(require('../src/'))
  angular.mock.module('test')
  angular.mock.inject(function ($injector) {
    $injector.get('httpEtag')
    // httpEtag = $injector.get('httpEtag')
    $http = $injector.get('$http')
    $httpBackend = $injector.get('$httpBackend')

    cachedSpy = spy('cached', angular.noop)
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
  })
})

it('should cache response and ETag data', function () {
  $http.get('/1.json', { etagCache: true })
    .cached(cachedSpy)
    .success(successSpy)
  $httpBackend.flush()

  cachedSpy.should.have.not.been.called
  successSpy.should.have.been.called.once

  $http.get('/1.json', { etagCache: true })
    .cached(cachedSpy)
    .error(errorSpy)
  $httpBackend.flush()

  cachedSpy.should.have.been.called.once
  errorSpy.should.have.been.called.once
})

it('should use a different itemKey for requests with params', function () {
  $http.get('/1.json', { etagCache: true })
    .cached(cachedSpy)
    .success(successSpy)
  $httpBackend.flush()

  $http
    .get('/1.json', {
      etagCache: true,
      params: mockParams
    })
    .cached(cachedSpy)
    .success(successSpy)
  $httpBackend.flush()

  successSpy.should.have.been.called.twice

  $http
    .get('/1.json', {
      etagCache: true,
      params: mockParams
    })
    .cached(cachedSpy)
    .success(successSpy)
    .error(errorSpy)
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
    .cached(cachedSpy)
    .success(successSpy)
  $httpBackend.flush()

  $http(httpConfig)
    .cached(function (data, status, headers, config, itemCache) {
      data.should.deep.equal(mockResponseData)
      should.not.exist(status)
      should.not.exist(headers)
      config.method.should.equal(httpConfig.method)
      config.url.should.equal(httpConfig.url)
      config.etagCache.should.equal(httpConfig.etagCache)
      var cacheInfo = itemCache.info()
      cacheInfo.id.should.equal('httpEtagCache')
    })
    .error(errorSpy)
  $httpBackend.flush()
})

it('should accept a string specifying desired cacheId', function () {
  $http.get('/1.json', { etagCache: 'testCache' })
    .cached(cachedSpy)
    .success(successSpy)
  $httpBackend.flush()

  $http.get('/1.json', { etagCache: 'testCache' })
    .cached(cachedSpy)
    .error(errorSpy)
  $httpBackend.flush()

  cachedSpy.should.have.been.called.once
  errorSpy.should.have.been.called.once
})

it('should accept an object specifying desired cacheId', function () {
  var cacheConfig = {
    id: 'testCache'
  }

  $http.get('/1.json', { etagCache: cacheConfig })
    .cached(cachedSpy)
    .success(successSpy)
  $httpBackend.flush()

  $http.get('/1.json', { etagCache: cacheConfig })
    .cached(cachedSpy)
    .error(errorSpy)
  $httpBackend.flush()

  cachedSpy.should.have.been.called.once
  errorSpy.should.have.been.called.once
})
