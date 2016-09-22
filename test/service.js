'use strict'

var angular = require('angular')
var chai = require('chai')
var should = chai.should()

var httpEtagProvider
var httpEtag

var cacheIds = [
  '$cacheFactoryTestCache',
  'localStorageTestCache',
  'sessionStorageTestCache'
]
var testValue
var testRawValue
var testBigValue

var bigValueSize = 30 * 1024 * 1024
for (var i = 0; i < bigValueSize; i++) {
  testBigValue += 'x'
}

describe('Service', function () {
  beforeEach(function () {
    testValue = [{ hi: true, mom: [{ 1: '😍' }] }]
    testRawValue = {
      responseData: testValue,
      etagHeader: '101',
      other: testValue
    }

    angular
      .module('test', ['http-etag'])
      .config(['httpEtagProvider', function (__httpEtagProvider) {
        httpEtagProvider = __httpEtagProvider
        httpEtagProvider
          .defineCache('httpEtagCache', {
            cacheService: 'localStorage',
            cacheOptions: { hello: 'friend' }
          })

          .defineCache('$cacheFactoryTestCache', {
            cacheService: '$cacheFactory'
          })
          .defineCache('$cacheFactoryTestCacheTwo', {
            cacheService: '$cacheFactory'
          })
          .defineCache('localStorageTestCache', {
            cacheService: 'localStorage'
          })
          .defineCache('localStorageTestCacheTwo', {
            cacheService: 'localStorage'
          })
          .defineCache('sessionStorageTestCache', {
            cacheService: 'sessionStorage'
          })
          .defineCache('sessionStorageTestCacheTwo', {
            cacheService: 'sessionStorage'
          })

          .defineCache('referenceCopyTestCache', {
            deepCopy: false,
            cacheService: '$cacheFactory'
          })
          .defineCache('deepCopyTestCache', {
            deepCopy: true,
            cacheService: '$cacheFactory'
          })
      }])

    angular.mock.module(require('../lib-test/'))
    angular.mock.module('test')
    angular.mock.inject(function ($injector) {
      httpEtag = $injector.get('httpEtag')
    })
  })

  afterEach(function () {
    httpEtag.purgeCaches()
  })

  it('should get the default cache with no arguments', function () {
    var cache = httpEtag.getCache()
    cache.should.be.an('object')
  })

  it('should allow for custom default cache configuration', function () {
    var defaultOptions = httpEtag.getCache().info().cacheOptions
    defaultOptions.hello.should.equal('friend')
  })

  it('`info` method should return all cache configs', function () {
    httpEtag.info().should.be.an('object')
    httpEtag.info()['httpEtagCache'].cacheOptions.should.be.an('object')
  })

  it('`getCache` method should return a cache object', function () {
    var cache = httpEtag.getCache('httpEtagCache')
    cache.should.be.an('object')
    cache.getItem.should.be.a('function')
    cache.setItem.should.be.a('function')
    cache.removeItem.should.be.a('function')
    cache.removeAllItems.should.be.a('function')
  })

  it('`getItemCache` method should return an itemCache object', function () {
    var itemCache = httpEtag.getItemCache('httpEtagCache', 'test')
    itemCache.should.be.an('object')
    itemCache.get.should.be.a('function')
    itemCache.set.should.be.a('function')
    itemCache.remove.should.be.a('function')
  })

  it('`getItemCache` method should return undefined when bad cacheId is specified', function () {
    var itemCache = httpEtag.getItemCache('Whoops', 'test')
    should.not.exist(itemCache)
  })

  it('`purgeCaches` method should remove all items from all caches', function () {
    var caches = cacheIds.map(httpEtag.getCache)
    caches.forEach(function (cache) {
      cache.setItem('hello', 'world')
      cache.setItem('greetings', 'universe')
    })

    httpEtag.purgeCaches()

    caches.forEach(function (cache) {
      should.not.exist(cache.getItem('hello'))
      should.not.exist(cache.getItem('greetings'))
    })
  })

  /**
   * CACHE TESTS
   */

  describe('Cache Object', function () {
    describe('`info` method should return cache info', function () {
      cacheIds.forEach(function (id) {
        it('(using ' + id.replace('TestCache', '') + ')', function () {
          var cache = httpEtag.getCache(id)
          cache.info().cacheOptions.should.be.an('object')
        })
      })
    })

    describe('`setItem` and `getItem` should set and get item data', function () {
      cacheIds.forEach(function (id) {
        it('(using ' + id.replace('TestCache', '') + ')', function () {
          var cache = httpEtag.getCache(id)
          cache.setItem('test', testValue)
          cache.getItem('test').should.deep.equal(testValue)
        })
      })
    })

    describe('`$setItem` and `$getItem` should interact with the raw cache value', function () {
      cacheIds.forEach(function (id) {
        it('(using ' + id.replace('TestCache', '') + ')', function () {
          var cache = httpEtag.getCache(id)
          cache.$setItem('test', testRawValue)

          var value = cache.getItem('test')
          var rawValue = cache.$getItem('test')

          value.should.deep.equal(testRawValue.responseData)
          rawValue.should.deep.equal(testRawValue)
        })
      })
    })

    describe('`unsetItem` should remove response data', function () {
      cacheIds.forEach(function (id) {
        it('(using ' + id.replace('TestCache', '') + ')', function () {
          var cache = httpEtag.getCache(id)
          cache.$setItem('test', testRawValue)
          cache.unsetItem('test')

          var value = cache.getItem('test')
          var rawValue = cache.$getItem('test')

          should.not.exist(value)
          should.not.exist(rawValue.responseData)
          rawValue.etagHeader.should.deep.equal(testRawValue.etagHeader)
          rawValue.other.should.deep.equal(testRawValue.other)
        })
      })
    })

    describe('`expireItem` should remove etag data', function () {
      cacheIds.forEach(function (id) {
        it('(using ' + id.replace('TestCache', '') + ')', function () {
          var cache = httpEtag.getCache(id)
          cache.$setItem('test', testRawValue)
          cache.expireItem('test')

          var rawValue = cache.$getItem('test')

          should.not.exist(rawValue.etagHeader)
          should.exist(rawValue.responseData)
        })
      })
    })

    describe('`removeItem` should remove all item data', function () {
      cacheIds.forEach(function (id) {
        it('(using ' + id.replace('TestCache', '') + ')', function () {
          var cache = httpEtag.getCache(id)
          cache.setItem('test', testValue)
          cache.removeItem('test')
          should.not.exist(cache.getItem('test'))
        })
      })
    })

    describe('`removeAllItems` should remove all item data', function () {
      cacheIds.forEach(function (id) {
        it('(using ' + id.replace('TestCache', '') + ')', function () {
          var cache = httpEtag.getCache(id)
          cache.setItem('test1', testValue)
          cache.setItem('test2', ':D')
          cache.removeAllItems()
          should.not.exist(cache.getItem('test1'))
          should.not.exist(cache.getItem('test2'))
        })
      })
    })

    describe('`removeAllItems` should not remove data from other caches', function () {
      cacheIds.forEach(function (id) {
        it('(using ' + id.replace('TestCache', '') + ')', function () {
          var cache = httpEtag.getCache(id)
          var otherCache = httpEtag.getCache(id + 'Two')

          cache.setItem('hello', testValue)
          otherCache.setItem('hello', testValue)

          cache.removeAllItems()
          should.exist(otherCache.getItem('hello'))
        })
      })
    })

    describe('`getItemCache` should return an itemCache object', function () {
      cacheIds.forEach(function (id) {
        it('(using ' + id.replace('TestCache', '') + ')', function () {
          var cache = httpEtag.getCache(id)
          var itemCache = cache.getItemCache('test')
          itemCache.should.be.an('object')
          itemCache.get.should.be.a('function')
          itemCache.set.should.be.a('function')
          itemCache.remove.should.be.a('function')
        })
      })
    })

    describe('`setItem` should not throw exception on very large items', function () {
      cacheIds.forEach(function (id) {
        it('(using ' + id.replace('TestCache', '') + ')', function () {
          var cache = httpEtag.getCache(id)
          function setBigItem () {
            cache.setItem('test', testBigValue)
          }
          setBigItem.should.not.throw(Error)
        })
      })
    })

    it('deepCopy cache config option should deep copy on set', function () {
      var testValue = [{ hi: true, mom: [{ 1: '😍' }] }]

      var refCopyCache = httpEtag.getCache('referenceCopyTestCache')
      var deepCopyCache = httpEtag.getCache('deepCopyTestCache')

      refCopyCache.setItem('test', testValue)
      deepCopyCache.setItem('test', testValue)

      testValue.push(':D')

      refCopyCache.getItem('test').should.equal(testValue)
      deepCopyCache.getItem('test').should.not.deep.equal(testValue)
    })

    it('deepCopy cache config option should deep copy on get', function () {
      var testValue = [{ hi: true, mom: [{ 1: '😍' }] }]

      var refCopyCache = httpEtag.getCache('referenceCopyTestCache')
      var deepCopyCache = httpEtag.getCache('deepCopyTestCache')

      refCopyCache.setItem('test', testValue)
      deepCopyCache.setItem('test', testValue)

      var refCopy = refCopyCache.getItem('test')
      var deepCopy = deepCopyCache.getItem('test')

      refCopy.push(':D')
      deepCopy.push(':D')

      refCopy.should.equal(refCopyCache.getItem('test'))
      deepCopy.should.not.deep.equal(deepCopyCache.getItem('test'))
    })
  })

  /**
   * ITEM CACHE TESTS
   */

  describe('Item Cache Object', function () {
    describe('`info` method should return cache info', function () {
      cacheIds.forEach(function (id) {
        it('(using ' + id.replace('TestCache', '') + ')', function () {
          var itemCache = httpEtag.getItemCache(id, 'test')
          itemCache.info().itemKey.should.equal('test')
        })
      })
    })

    describe('`set` and `get` should set and get item data', function () {
      cacheIds.forEach(function (id) {
        it('(using ' + id.replace('TestCache', '') + ')', function () {
          var itemCache = httpEtag.getItemCache(id, 'test')
          itemCache.set(testValue)
          itemCache.get().should.deep.equal(testValue)
        })
      })
    })

    describe('`$set` and `$get` should interact with the raw cache value', function () {
      cacheIds.forEach(function (id) {
        it('(using ' + id.replace('TestCache', '') + ')', function () {
          var itemCache = httpEtag.getItemCache(id, 'test')
          itemCache.$set(testRawValue)

          var value = itemCache.get()
          var rawValue = itemCache.$get()

          value.should.deep.equal(testRawValue.responseData)
          rawValue.should.deep.equal(testRawValue)
        })
      })
    })

    describe('`unset` should remove response data', function () {
      cacheIds.forEach(function (id) {
        it('(using ' + id.replace('TestCache', '') + ')', function () {
          var itemCache = httpEtag.getItemCache(id, 'test')
          itemCache.$set(testRawValue)
          itemCache.unset()

          var value = itemCache.get()
          var rawValue = itemCache.$get()

          should.not.exist(value)
          should.not.exist(rawValue.responseData)
          rawValue.etagHeader.should.deep.equal(testRawValue.etagHeader)
          rawValue.other.should.deep.equal(testRawValue.other)
        })
      })
    })

    describe('`expire` should remove etag data', function () {
      cacheIds.forEach(function (id) {
        it('(using ' + id.replace('TestCache', '') + ')', function () {
          var itemCache = httpEtag.getItemCache(id, 'test')
          itemCache.$set(testRawValue)
          itemCache.expire()

          var rawValue = itemCache.$get()

          should.not.exist(rawValue.etagHeader)
          should.exist(rawValue.responseData)
        })
      })
    })

    describe('`remove` should remove item data', function () {
      cacheIds.forEach(function (id) {
        it('(using ' + id.replace('TestCache', '') + ')', function () {
          var itemCache = httpEtag.getItemCache(id, 'test')
          itemCache.set(testValue)
          itemCache.remove()
          should.not.exist(itemCache.get())
        })
      })
    })
  })
})
