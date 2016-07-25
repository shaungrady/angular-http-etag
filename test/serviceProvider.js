'use strict'

var angular = require('angular')
var chai = require('chai')
chai.should()

var httpEtagProvider
var httpEtag

beforeEach(function () {
  angular
    .module('test', ['http-etag'])
    .config(['httpEtagProvider', function (__httpEtagProvider) {
      httpEtagProvider = __httpEtagProvider
    }])

  angular.mock.module(require('../src/'))
  angular.mock.module('test')
  angular.mock.inject(function ($injector) {
    httpEtag = $injector.get('httpEtag')
  })
})

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

it('should have a default cache defined automatically', function () {
  httpEtag.getCache().should.be.an('object')
})
