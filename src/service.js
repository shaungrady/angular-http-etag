'use strict'

var angular = require('angular')
module.exports = httpEtagProvider

function httpEtagProvider () {
  var httpEtagProvider = this

  var serviceAdapterMethods = [
    'createCache',
    'getCache'
  ]

  var cacheAdapterMethods = [
    'setItem',
    'getItem',
    'removeItem',
    'removeAllItems'
  ]

  var itemCacheMethods = [
    'set',
    'get',
    'remove'
  ]

  var cacheAdapters = {

    'localStorage': {
      createCache: angular.noop,
      getCache: function () {
        return localStorage
      },
      setItem: function (localStorage, itemKey, value) {
        localStorage.setItem(itemKey, JSON.stringify(value))
      },
      getItem: function (localStorage, itemKey) {
        return JSON.parse(localStorage.getItem(itemKey))
      },
      removeItem: function (localStorage, itemKey) {
        localStorage.removeItem(itemKey)
      },
      removeAllItems: function (localStorage, itemKey) {
        angular.forEach(localStorage, function (value, key) {
          localStorage.removeItem(key)
        })
      }
    },

    'sessionStorage': {
      createCache: angular.noop,
      getCache: function () {
        return sessionStorage
      },
      setItem: function (sessionStorage, itemKey, value) {
        sessionStorage.setItem(itemKey, JSON.stringify(value))
      },
      getItem: function (sessionStorage, itemKey) {
        return JSON.parse(sessionStorage.getItem(itemKey))
      },
      removeItem: function (sessionStorage, itemKey) {
        sessionStorage.removeItem(itemKey)
      },
      removeAllItems: function (sessionStorage, itemKey) {
        angular.forEach(sessionStorage, function (value, key) {
          sessionStorage.removeItem(key)
        })
      }
    },

    '$cacheFactory': {
      createCache: function ($cacheFactory, cacheId, options) {
        $cacheFactory(cacheId, options)
      },
      getCache: function ($cacheFactory, cacheId) {
        return $cacheFactory.get(cacheId)
      },
      setItem: function (cache, itemKey, value) {
        cache.put(itemKey, value)
      },
      getItem: function (cache, itemKey) {
        return cache.get(itemKey)
      },
      removeItem: function (cache, itemKey) {
        cache.remove(itemKey)
      },
      removeAllItems: function (cache, itemKey) {
        cache.removeAll()
      }
    }

  }
  var cacheDefinitions = {}

  var defaultCacheId = 'httpEtagCache'
  var defaultEtagCacheOptions = {
    deepCopy: false,
    cacheService: '$cacheFactory',
    cacheOptions: {
      number: 25
    }
  }

  /**
   * SERVICE PROVIDER
   * .setDefaultCacheOptions(options)
   * .defineCache(cacheId, options)
   * .defineCacheServiceAdapter(serviceName, config)
   * .getCacheServiceAdapter(serviceName)
   */

  httpEtagProvider.setDefaultCacheOptions = function httpEtagSetDefaultCacheOptions (options) {
    defaultEtagCacheOptions = angular.extend({}, defaultEtagCacheOptions, options)
    return httpEtagProvider
  }

  httpEtagProvider.defineCache = function httpEtagDefineCache (cacheId, options) {
    var config = angular.extend({}, defaultEtagCacheOptions, options, { id: cacheId })
    cacheDefinitions[cacheId] = config
    return httpEtagProvider
  }

  httpEtagProvider.defineCacheServiceAdapter = function httpEtagDefineCacheServiceAdapter (serviceName, config) {
    // TODO: Require all required methods be defined
    cacheAdapters[serviceName] = config
    return httpEtagProvider
  }

  httpEtagProvider.getCacheServiceAdapter = function httpEtagGetCacheServiceAdapter (serviceName) {
    return cacheAdapters[serviceName]
  }

  /**
   * SERVICE
   * .info()
   * .getCache(acheId)
   * .getItemCache(cacheId, itemKey)
   */

  httpEtagProvider.$get = ['polyfills', '$injector', function (polyfills, $injector) {
    var httpEtagService = {}

    var services = {}
    var adaptedServices = {}
    var caches = {}
    var adaptedCaches = {}

    // Find/inject cache service and create adapted versions
    angular.forEach(cacheAdapters, function (adapterMethods, serviceName) {
      var service = services[serviceName] = window[serviceName] || $injector.get(serviceName)
      var adaptedService = adaptedServices[serviceName] = {}

      angular.forEach(serviceAdapterMethods, function (method) {
        adaptedService[method] = angular.bind({}, adapterMethods[method], service)
      })
    })

    // Add default cache if not already defined
    if (!cacheDefinitions[defaultCacheId]) httpEtagProvider.defineCache(defaultCacheId)

    // Instantiate caches and create adapted versions
    angular.forEach(cacheDefinitions, function (config, cacheId) {
      adaptedServices[config.cacheService].createCache(cacheId, config)
      var cache = caches[cacheId] = adaptedServices[config.cacheService].getCache(cacheId)
      var adaptedCache = adaptedCaches[cacheId] = {}

      angular.forEach(cacheAdapterMethods, function (method) {
        adaptedCache[method] = angular.bind({}, cacheAdapters[config.cacheService][method], cache)
      })

      adaptedCache.getItemCache = function adaptedCacheGetItemCache (itemKey) {
        return httpEtagService.getItemCache(cacheId, itemKey)
      }
      adaptedCache.info = function adaptedCacheInfo () {
        return cacheDefinitions[cacheId]
      }
    })

    httpEtagService.info = function httpEtagServiceInfo () {
      return cacheDefinitions
    }

    httpEtagService.getCache = function httpEtagServiceGetCache (cacheId) {
      return adaptedCaches[processCacheId(cacheId)]
    }

    httpEtagService.getItemCache = function httpEtagServiceGeItemCache (cacheId, itemKey) {
      var cache = httpEtagService.getCache(cacheId)
      var itemCache = {}

      angular.forEach(cacheAdapterMethods, function (method, i) {
        var itemCacheMethod = itemCacheMethods[i]
        if (itemCacheMethod) {
          itemCache[itemCacheMethod] = angular.bind({}, cache[method], itemKey)
        }
      })

      itemCache.info = function itemCacheInfo () {
        var itemCacheInfo = cache.info()
        itemCacheInfo.itemKey = itemKey
        return itemCacheInfo
      }

      return itemCache
    }

    function processCacheId (cacheId) {
      var type = typeof cacheId
      var isDefined = type === 'number' || (type === 'string' && !!cacheId)
      return isDefined ? cacheId : defaultCacheId
    }

    return httpEtagService
  }]
}
