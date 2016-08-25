'use strict'

var angular = require('angular')
var chai = require('chai')
var expect = chai.expect
chai.should()

var httpEtagProvider
var httpEtag

describe('Service Provider', function () {
  beforeEach(function () {
    angular
      .module('test', ['http-etag'])
      .config(['httpEtagProvider', function (__httpEtagProvider) {
        httpEtagProvider = __httpEtagProvider
      }])

    angular.mock.module(require('../lib/'))
    angular.mock.module('test')
    angular.mock.inject(function ($injector) {
      httpEtag = $injector.get('httpEtag')
    })
  })

  it('should allow for getting default cache creation config', function () {
    var defaultConfig = httpEtagProvider.getDefaultCacheConfig()
    defaultConfig.should.be.an('object')
  })

  it('should allow for setting default cache creation config', function () {
    var newOptions = {
      cacheService: 'RonaldMcD',
      cacheOptions: {
        weightIncrease: 250
      }
    }

    var newDefaultOptions = httpEtagProvider
      .setDefaultCacheConfig(newOptions)
      .getDefaultCacheConfig()

    var cacheService = newDefaultOptions.cacheService
    var weightIncrease = newDefaultOptions.cacheOptions.weightIncrease

    cacheService.should.equal('RonaldMcD')
    expect(weightIncrease).to.equal(250)
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
})
