/**
 * angular-http-etag v2.0.13
 * Shaun Grady (http://shaungrady.com), 2016
 * https://github.com/shaungrady/angular-http-etag
 * Module Format: CommonJS
 * License: MIT
 */

'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var angular = _interopDefault(require('angular'));
var deepcopy = _interopDefault(require('deepcopy'));
var objectKeys = _interopDefault(require('object-keys'));
var arrayMap = _interopDefault(require('array-map'));

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
    // info method hard-coded
  ]

  var requiredAdapterMethods = serviceAdapterMethods.concat(cacheAdapterMethods)

  // Built-in adapters defined in ./cacheServiceAdapters.js
  var cacheAdapters = {}
  var cacheDefinitions = {}

  // Cache config defaults
  var defaultCacheId = 'httpEtagCache'
  var defaultEtagCacheConfig = {
    deepCopy: false,
    cacheResponseData: true,
    cacheService: '$cacheFactory',
    cacheOptions: {
      number: 25
    }
  }

  /**
   * SERVICE PROVIDER
   * .setDefaultCacheConfig(config)
   * .defineCache(cacheId, config)
   * .defineCacheServiceAdapter(serviceName, config)
   * .getCacheServiceAdapter(serviceName)
   */

  httpEtagProvider.setDefaultCacheConfig = function httpEtagSetDefaultCacheOptions (config) {
    defaultEtagCacheConfig = angular.extend({}, defaultEtagCacheConfig, config)
    return httpEtagProvider
  }

  httpEtagProvider.getDefaultCacheConfig = function httpEtagGetDefaultCacheOptions () {
    return defaultEtagCacheConfig
  }

  httpEtagProvider.defineCache = function httpEtagDefineCache (cacheId, config) {
    config = angular.extend({}, defaultEtagCacheConfig, config, { id: cacheId })
    cacheDefinitions[cacheId] = config
    return httpEtagProvider
  }

  httpEtagProvider.defineCacheServiceAdapter = function httpEtagDefineCacheServiceAdapter (serviceName, config) {
    if (!config) throw new Error('Missing cache service adapter configuration')
    if (!config.methods) throw new Error('Missing cache service adapter configuration methods')
    angular.forEach(requiredAdapterMethods, function (method) {
      if (typeof config.methods[method] !== 'function') {
        throw new Error('Expected cache service adapter method "' + method + '" to be a function')
      }
    })

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

  httpEtagProvider.$get = ['$injector', function httpEtagFactory ($injector) {
    var httpEtagService = {}

    var services = {}
    var adaptedServices = {}
    var caches = {}
    var adaptedCaches = {}

    // Add default cache if not already defined
    if (!cacheDefinitions[defaultCacheId]) httpEtagProvider.defineCache(defaultCacheId)

    // Find/inject cache service and create adapted versions
    angular.forEach(cacheAdapters, function adaptCacheService (adapter, serviceName) {
      var service = services[serviceName] = window[serviceName] || $injector.get(serviceName)
      var adaptedService = adaptedServices[serviceName] = {}

      angular.forEach(serviceAdapterMethods, function (method) {
        adaptedService[method] = angular.bind({}, adapter.methods[method], service)
      })
    })

    // Instantiate caches and create adapted versions
    angular.forEach(cacheDefinitions, function adaptCache (config, cacheId) {
      adaptedServices[config.cacheService].createCache(cacheId, config)
      var cache = caches[cacheId] = adaptedServices[config.cacheService].getCache(cacheId)
      var adaptedCache = adaptedCaches[cacheId] = {}
      // Determine whether to perform deepcopying or not
      var serviceDeepCopies = cacheAdapters[config.cacheService].config.storesDeepCopies
      var deepCopy = !serviceDeepCopies && cacheDefinitions[cacheId].deepCopy
      var copy = function (value) {
        return deepCopy ? deepcopy(value) : value
      }

      angular.forEach(cacheAdapterMethods, function (method) {
        var adapterMethod = cacheAdapters[config.cacheService].methods[method]
        var wrappedMethod
        var wrappedRawMethod

        // Wrap set/get methods to set/get to the `responseData` property of an
        // object. This is where the $http interceptor stores response data.
        if (method === 'getItem') {
          wrappedMethod = function getCacheItemResponseData (cache, itemKey, options) {
            var cachedData = adapterMethod(cache, itemKey, options)
            return cachedData && copy(cachedData.responseData)
          }

          wrappedRawMethod = function getCacheItemData (cache, itemKey, options) {
            return copy(adapterMethod(cache, itemKey, options))
          }
        }

        if (method === 'setItem') {
          wrappedMethod = function setCacheItemResponseData (cache, itemKey, value, options) {
            var cachedData = adaptedCache.$getItem(itemKey)
            value = copy(value)

            if (cachedData && typeof cachedData === 'object') {
              cachedData.responseData = value
              value = cachedData
            } else value = { responseData: value }

            adapterMethod(cache, itemKey, value, options)
          }

          wrappedRawMethod = function setCacheItemData (cache, itemKey, value, options) {
            adapterMethod(cache, itemKey, copy(value), options)
          }
        }

        adaptedCache[method] = angular.bind({}, (wrappedMethod || adapterMethod), cache)
        if (wrappedRawMethod) {
          adaptedCache['$' + method] = angular.bind({}, wrappedRawMethod, cache)
        }
      })

      adaptedCache.unsetItem = function adaptedCacheUnsetItemCache (itemKey) {
        adaptedCache.setItem(itemKey, undefined)
      }
      adaptedCache.expireItem = function adaptedCacheUnsetItemCache (itemKey) {
        var data = adaptedCache.$getItem(itemKey)
        delete data.etagHeader
        adaptedCache.$setItem(itemKey, data)
      }
      adaptedCache.getItemCache = function adaptedCacheGetItemCache (itemKey) {
        return httpEtagService.getItemCache(cacheId, itemKey)
      }
      adaptedCache.info = function adaptedCacheInfo () {
        return cacheDefinitions[cacheId]
      }
      adaptedCache.isCache = true
    })

    httpEtagService.info = function httpEtagServiceInfo () {
      return cacheDefinitions
    }

    httpEtagService.getCache = function httpEtagServiceGetCache (cacheId) {
      var cache = adaptedCaches[processCacheId(cacheId)]
      if (cache) return cache
    }

    httpEtagService.getItemCache = function httpEtagServiceGeItemCache (cacheId, itemKey) {
      var cache = httpEtagService.getCache(cacheId)
      var itemCache = {}
      if (!cache) return

      var methodMappings = [
        ['set', 'setItem'],
        ['get', 'getItem'],
        ['$set', '$setItem'],
        ['$get', '$getItem'],
        ['unset', 'unsetItem'],
        ['expire', 'expireItem'],
        ['remove', 'removeItem']
      ]

      angular.forEach(methodMappings, function mapCacheMethdodsToItemCache (methods) {
        itemCache[methods[0]] = angular.bind({}, cache[methods[1]], itemKey)
      })

      itemCache.info = function itemCacheInfo () {
        var itemCacheInfo = cache.info()
        itemCacheInfo.itemKey = itemKey
        return itemCacheInfo
      }

      itemCache.isItemCache = true

      return itemCache
    }

    httpEtagService.purgeCaches = function httpEtagPurgeCaches () {
      angular.forEach(adaptedCaches, function (cache) {
        cache.removeAllItems()
      })
    }

    function processCacheId (cacheId) {
      var type = typeof cacheId
      var isDefined = type === 'number' || (type === 'string' && !!cacheId)
      return isDefined ? cacheId : defaultCacheId
    }

    return httpEtagService
  }]
}

httpEtagHttpDecorator.$inject = ['$delegate', 'httpEtag']

function httpEtagHttpDecorator ($delegate, httpEtag) {
  var $http = $delegate
  var cachableHttpMethods = [
    'GET',
    'JSONP'
  ]

  function $httpDecorator (httpConfig) {
    var useLegacyPromiseExtensions = httpEtagHttpDecorator.useLegacyPromiseExtensions()
    var hasConfig = !!httpConfig.etagCache
    var isCacheableMethod = cachableHttpMethods.indexOf(httpConfig.method) >= 0
    var isCachable = hasConfig && isCacheableMethod
    var httpPromise

    if (isCachable) {
      var etagCacheConfig = processHttpConfigEtagValue(httpConfig)
      if (etagCacheConfig) {
        var itemCache = httpEtag.getItemCache(etagCacheConfig.id, etagCacheConfig.itemKey)
        if (!itemCache) throw new Error('No defined ETag caches match specified cache ID')

        var cacheInfo = itemCache.info()
        var rawCacheData = itemCache.$get()
        var cachedEtag = rawCacheData && rawCacheData.etagHeader
        var cachedResponse = cachedEtag && rawCacheData.responseData

        // Allow easy access to cache in interceptor
        httpConfig.$$_itemCache = itemCache

        if (cachedEtag) {
          httpConfig.headers = angular.extend({}, httpConfig.headers, {
            'If-None-Match': cachedEtag
          })
        }
      }
    }

    httpPromise = $http.apply($http, arguments)
    httpEtagPromiseFactory(httpPromise)

    function httpEtagPromiseFactory (httpPromise) {
      var then = httpPromise.then
      var success = httpPromise.success

      httpPromise.cached = function httpEtagPromiseCached (callback) {
        if (isCachable && rawCacheData && cacheInfo.cacheResponseData) {
          if(useLegacyPromiseExtensions) {
            callback(cachedResponse, 'cached', undefined, httpConfig, itemCache)
          } else {
            callback({
              data: cachedResponse,
              status: 'cached',
              headers: undefined,
              config: httpConfig
            }, itemCache)
          }  
        }
        return httpPromise
      }

      httpPromise.then = function httpEtagThenWrapper (successCallback, errorCallback, progressBackCallback) {
        var thenPromise = then.apply(httpPromise, [
          successCallback ? httpEtagSuccessWrapper : undefined,
          errorCallback ? httpEtagErrorWrapper : undefined,
          progressBackCallback
        ])

        function httpEtagSuccessWrapper (response) {
          return successCallback(response, itemCache)
        }

        function httpEtagErrorWrapper (response) {
          return errorCallback(response, itemCache)
        }

        return httpEtagPromiseFactory(thenPromise)
      }

      if (useLegacyPromiseExtensions && itemCache) {
        httpPromise.success = function httpEtagPromiseSuccess (callback) {
          var partializedCallback = partial(callback, undefined, undefined, undefined, undefined, itemCache)
          return success.apply(httpPromise, [partializedCallback])
        }
      }

      return httpPromise
    }

    return httpPromise
  }

  // Decorate the cachable shortcut methods, too
  angular.forEach(cachableHttpMethods, function (httpMethod) {
    var method = httpMethod.toLowerCase()
    $httpDecorator[method] = function httpEtagHttpShortcutWrapper (url, config) {
      config = angular.extend({}, config, {
        method: httpMethod,
        url: url
      })

      return $httpDecorator.call($http, config)
    }
  })

  // Copy over all other properties and methods
  angular.forEach($http, function copyHttpPropertyToDectorator (value, key) {
    if (!$httpDecorator[key]) $httpDecorator[key] = value
  })

  /**
   * HELPERS
   */

  function processHttpConfigEtagValue (httpConfig) {
    var etagValue = httpConfig.etagCache
    var etagValueType = typeof etagValue
    var etagCacheConfig = {}

    // Evaluate function first
    if (etagValueType === 'function') {
      etagValue = etagValue(httpConfig)
      etagValueType = typeof etagValue
    }

    // Plain, cache, or itemCache objects
    if (etagValueType === 'object') {
      var id, itemKey

      if (etagValue.isCache) {
        id = etagValue.info().id
        itemKey = generateCacheItemKey(httpConfig)
      } else if (etagValue.isItemCache) {
        id = etagValue.info().id
        itemKey = etagValue.info().itemKey
      } else {
        id = etagValue.id
        itemKey = etagValue.itemKey || generateCacheItemKey(httpConfig)
      }

      etagCacheConfig.id = id
      etagCacheConfig.itemKey = itemKey
    } else if (etagValueType === 'string') {
      etagCacheConfig.id = etagValue
      etagCacheConfig.itemKey = generateCacheItemKey(httpConfig)
    } else if (etagValue === true) {
      // Undefined cacheId will use the default cacheId as defined in provider
      etagCacheConfig.itemKey = generateCacheItemKey(httpConfig)
    } else return
    return etagCacheConfig
  }

  function generateCacheItemKey (httpConfig) {
    var url = httpConfig.url
    var params = stringifyParams(httpConfig.params)
    var joiner = ((params && url.indexOf('?') > 0) ? '&' : '?')
    var queryString = (params && joiner + params) || ''
    return url + queryString
  }

  // Based on npm package "query-string"
  function stringifyParams (obj) {
    return obj ? arrayMap(objectKeys(obj).sort(), function (key) {
      var val = obj[key]

      if (angular.isArray(val)) {
        return arrayMap(val.sort(), function (val2) {
          return encodeURIComponent(key) + '=' + encodeURIComponent(val2)
        }).join('&')
      }

      return encodeURIComponent(key) + '=' + encodeURIComponent(val)
    }).join('&') : ''
  }

  // http://ejohn.org/blog/partial-functions-in-javascript/
  function partial (fn) {
    var args = Array.prototype.slice.call(arguments, 1)
    return function () {
      var arg = 0
      for (var i = 0; i < args.length && arg < arguments.length; i++) {
        if (args[i] === undefined) args[i] = arguments[arg++]
      }
      return fn.apply(this, args)
    }
  }

  return $httpDecorator
}

function httpEtagInterceptorFactory () {
  function responseInterceptor (response) {
    var itemCache = response.config.$$_itemCache

    if (itemCache) {
      var cacheInfo = itemCache.info()
      var cacheResponseData = cacheInfo.cacheResponseData
      var etag = response.headers().etag
      var cacheData = {}

      if (etag) {
        cacheData.etagHeader = etag
        if (cacheResponseData) cacheData.responseData = response.data
        itemCache.$set(cacheData)
      }

      delete response.config.$$_itemCache
    }

    return response
  }

  return {
    response: responseInterceptor
  }
}

cacheAdaptersConfig.$inject = ['httpEtagProvider']

function cacheAdaptersConfig (httpEtagProvider) {
  httpEtagProvider

    .defineCacheServiceAdapter('$cacheFactory', {
      config: {
        storesDeepCopies: false
      },
      methods: {
        createCache: function createCache ($cacheFactory, cacheId, options) {
          $cacheFactory(cacheId, options)
        },
        getCache: function getCache ($cacheFactory, cacheId) {
          return $cacheFactory.get(cacheId)
        },
        setItem: function setItem (cache, itemKey, value) {
          cache.put(itemKey, value)
        },
        getItem: function getItem (cache, itemKey) {
          return cache.get(itemKey)
        },
        removeItem: function removeItem (cache, itemKey) {
          cache.remove(itemKey)
        },
        removeAllItems: function removeAllItems (cache, itemKey) {
          cache.removeAll()
        }
      }
    })

    .defineCacheServiceAdapter('localStorage', {
      config: {
        storesDeepCopies: true
      },
      methods: {
        createCache: angular.noop,
        getCache: function getCache (localStorage, cacheId) {
          return cacheId
        },
        setItem: function setItem (cacheId, itemKey, value) {
          try {
            itemKey = cacheId + ':' + itemKey
            localStorage.setItem(itemKey, JSON.stringify(value))
          } catch (e) {

          }
        },
        getItem: function getItem (cacheId, itemKey) {
          itemKey = cacheId + ':' + itemKey
          return JSON.parse(localStorage.getItem(itemKey))
        },
        removeItem: function removeItem (cacheId, itemKey) {
          itemKey = cacheId + ':' + itemKey
          localStorage.removeItem(itemKey)
        },
        removeAllItems: function removeAllItems (cacheId, itemKey) {
          var keyPrefix = cacheId + ':'

          angular.forEach(localStorage, function (value, key) {
            if (key.indexOf(keyPrefix) === 0) {
              localStorage.removeItem(key)
            }
          })
        }
      }
    })

    .defineCacheServiceAdapter('sessionStorage', {
      config: {
        storesDeepCopies: true
      },
      methods: {
        createCache: angular.noop,
        getCache: function getCache (sessionStorage, cacheId) {
          return cacheId
        },
        setItem: function setItem (cacheId, itemKey, value) {
          try {
            itemKey = cacheId + ':' + itemKey
            sessionStorage.setItem(itemKey, JSON.stringify(value))
          } catch (e) {

          }
        },
        getItem: function getItem (cacheId, itemKey) {
          itemKey = cacheId + ':' + itemKey
          return JSON.parse(sessionStorage.getItem(itemKey))
        },
        removeItem: function removeItem (cacheId, itemKey) {
          itemKey = cacheId + ':' + itemKey
          sessionStorage.removeItem(itemKey)
        },
        removeAllItems: function removeAllItems (cacheId, itemKey) {
          var keyPrefix = cacheId + ':'

          angular.forEach(sessionStorage, function (value, key) {
            if (key.indexOf(keyPrefix) === 0) {
              sessionStorage.removeItem(key)
            }
          })
        }
      }
    })
}

var index = angular
  .module('http-etag', [])
  .provider('httpEtag', httpEtagProvider)
  .config(cacheAdaptersConfig)
  .config(['$provide', '$httpProvider', function addHttpEtagInterceptor ($provide, $httpProvider) {
    httpEtagHttpDecorator.useLegacyPromiseExtensions =
      $httpProvider.useLegacyPromiseExtensions ||
      function useLegacyPromiseExtensions () { return true }
    $provide.decorator('$http', httpEtagHttpDecorator)
    $httpProvider.interceptors.push(httpEtagInterceptorFactory)
  }])
  .name

module.exports = index;
