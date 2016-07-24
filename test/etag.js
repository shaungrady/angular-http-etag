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
  var $http, $httpBackend, $cacheFactory, httpEtag, httpEtagProvider, testModule, serverData,
    ifEtagIs, ifEtagIsNot, onCached, onSuccess, onError
  /* eslint-enable no-unused-vars */

  testModule = angular.module('test', ['http-etag']).config(['httpEtagProvider', function (__httpEtagProvider) {
    httpEtagProvider = __httpEtagProvider

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

      .defineCache('referenceCopyTest', {
        cacheService: '$cacheFactory',
        deepCopy: false
      })
      .defineCache('deepCopyTest', {
        cacheService: '$cacheFactory',
        deepCopy: true
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

  /**
   * SERVICE PROVIDER TESTS
   */

  describe('service provider', function () {
    it('should allow for getting default cache creation options', function () {
      var defaultConfig = httpEtagProvider.getDefaultCacheOptions()
      defaultConfig.should.be.an('object')
    })

    it('should allow for setting default cache creation options', function () {
      var newOptions = {
        cacheService: 'RonaldMcD',
        cacheOptions: {
          weightIncrease: 250
        }
      }

      var newDefaultOptions = httpEtagProvider
        .setDefaultCacheOptions(newOptions)
        .getDefaultCacheOptions()

      newDefaultOptions.cacheService.should.equal(newOptions.cacheService)
      newDefaultOptions.cacheOptions.weightIncrease.should.equal(newOptions.cacheOptions.weightIncrease)
    })

    it('should allow you to define a new cache with only an ID and return self', function () {
      httpEtagProvider
        .defineCache('newCache')
        .should.equal(httpEtagProvider)
    })

    it('should allow you to define a new cache with ID/options and return self', function () {
      httpEtagProvider
        .defineCache('newCache', {})
        .should.equal(httpEtagProvider)
    })

    it('should allow you to define a cache service adapter and return self', function () {
      httpEtagProvider
        .defineCacheServiceAdapter('serviceName', {
          methods: {
            createCache: angular.noop,
            getCache: angular.noop,
            setItem: angular.noop,
            getItem: angular.noop,
            removeItem: angular.noop,
            removeAllItems: angular.noop
          }
        })
        .should.equal(httpEtagProvider)
    })

    it('should allow you to get a cache service adapter', function () {
      var testAdapter = {
        methods: {
          createCache: angular.noop,
          getCache: angular.noop,
          setItem: angular.noop,
          getItem: angular.noop,
          removeItem: angular.noop,
          removeAllItems: angular.noop
        }
      }

      httpEtagProvider
        .defineCacheServiceAdapter('testAdapter', testAdapter)
        .getCacheServiceAdapter('testAdapter')
        .should.equal(testAdapter)
    })

    it('should throw an error when defining a malformed cache service adapter', function () {
      function missingConfig () {
        httpEtagProvider
          .defineCacheServiceAdapter('serviceName')
      }

      function missingMethods () {
        httpEtagProvider
          .defineCacheServiceAdapter('serviceName', {})
      }

      function badMethod () {
        httpEtagProvider
          .defineCacheServiceAdapter('serviceName', {
            methods: {
              createCache: angular.noop,
              getCache: 'hi :D',
              setItem: angular.noop,
              getItem: angular.noop,
              removeItem: angular.noop,
              removeAllItems: angular.noop
            }
          })
      }

      missingConfig.should.throw(Error)
      missingMethods.should.throw(Error)
      badMethod.should.throw(Error)
    })
  })

  /**
   * SERVICE TESTS
   */

  describe('service', function () {
    it('`info` method should return all cache configs', function () {
      httpEtag.info().should.be.an('object')
      httpEtag.info()['$cacheFactoryTest'].cacheOptions.should.be.an('object')
    })

    it('`getCache` method should return a cache', function () {
      var cache = httpEtag.getCache('$cacheFactoryTest')
      cache.should.be.an('object')
      cache.getItem.should.be.a('function')
      cache.setItem.should.be.a('function')
      cache.removeItem.should.be.a('function')
      cache.removeAllItems.should.be.a('function')
    })

    it('`getItemCache` method should return an itemCache', function () {
      var itemCache = httpEtag.getItemCache('$cacheFactoryTest', 'test')
      itemCache.should.be.an('object')
      itemCache.get.should.be.a('function')
      itemCache.set.should.be.a('function')
      itemCache.remove.should.be.a('function')
    })
  })

  /**
   * CACHE TESTS
   */

  describe('cache', function () {
    var testValue = [{ hi: true, mom: [{ 1: '😍' }] }]
    var cacheIds = [
      '$cacheFactoryTest',
      'localStorageTest',
      'sessionStorageTest'
    ]

    describe('`info` method should return cache info', function () {
      cacheIds.forEach(function (id) {
        it('(' + id + ')', function () {
          var cache = httpEtag.getCache(id)
          cache.info().cacheOptions.should.be.an('object')
        })
      })
    })

    describe('`setItem` and `getItem` should set and get item data', function () {
      cacheIds.forEach(function (id) {
        it('(' + id + ')', function () {
          var cache = httpEtag.getCache(id)
          cache.setItem('test', testValue)
          cache.getItem('test').should.deep.equal(testValue)
        })
      })
    })

    describe('`removeItem` should remove item data', function () {
      cacheIds.forEach(function (id) {
        it('(' + id + ')', function () {
          var cache = httpEtag.getCache(id)
          cache.setItem('test', testValue)
          cache.removeItem('test')
          should.not.exist(cache.getItem('test'))
        })
      })
    })

    describe('`removeAllItems` should remove all item data', function () {
      cacheIds.forEach(function (id) {
        it('(' + id + ')', function () {
          var cache = httpEtag.getCache(id)
          cache.setItem('test1', testValue)
          cache.setItem('test2', ':D')
          cache.removeAllItems()
          should.not.exist(cache.getItem('test1'))
          should.not.exist(cache.getItem('test2'))
        })
      })
    })
  })

  /**
   * ITEM CACHE TESTS
   */

  describe('item cache', function () {
    var testValue = [{ hi: true, mom: [{ 1: '😍' }] }]
    var cacheIds = [
      '$cacheFactoryTest',
      'localStorageTest',
      'sessionStorageTest'
    ]

    describe('`info` method should return cache info', function () {
      cacheIds.forEach(function (id) {
        it('(' + id + ')', function () {
          var itemCache = httpEtag.getItemCache(id, 'test')
          itemCache.info().itemKey.should.equal('test')
        })
      })
    })

    describe('`set` and `get` should set and get item data', function () {
      cacheIds.forEach(function (id) {
        it('(' + id + ')', function () {
          var itemCache = httpEtag.getItemCache(id, 'test')
          itemCache.set(testValue)
          itemCache.get().should.deep.equal(testValue)
        })
      })
    })

    describe('`remove` should remove item data', function () {
      cacheIds.forEach(function (id) {
        it('(' + id + ')', function () {
          var itemCache = httpEtag.getItemCache(id, 'test')
          itemCache.set(testValue)
          itemCache.remove()
          should.not.exist(itemCache.get())
        })
      })
    })
  })

  //
  //
  //

  /**
   *
   */

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

  it('"deepCopy" config option should work', function () {
    var testValue = [{ hi: true, mom: [{ 1: '😍' }] }]

    var refCopyCache = httpEtag.getCache('referenceCopyTest')
    var deepCopyCache = httpEtag.getCache('deepCopyTest')

    refCopyCache.setItem('test', testValue)
    refCopyCache.getItem('test').should.equal(testValue)

    deepCopyCache.setItem('test', testValue)
    deepCopyCache.getItem('test').should.not.equal(testValue)
    deepCopyCache.getItem('test').should.deep.equal(testValue)

    testValue.push(':D')

    refCopyCache.getItem('test').should.equal(testValue)
    refCopyCache.getItem('test').should.deep.equal(testValue)

    deepCopyCache.getItem('test').should.not.deep.equal(testValue)
  })

  it('Decorator/Interceptor should work', function () {
    $http.get('/1.json', { etagCache: true })
      .cached(onCached)
      .success(onSuccess)
    $httpBackend.flush()

    $http.get('/1.json', { etagCache: true })
      .cached(onCached)
      .error(onError)
    $httpBackend.flush()

    onCached.should.have.been.called.once
    onSuccess.should.have.been.called.once
    onError.should.have.been.called.once
  })
})
