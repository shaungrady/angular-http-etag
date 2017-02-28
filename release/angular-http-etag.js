/**
 * angular-http-etag v2.0.17
 * Shaun Grady (http://shaungrady.com), 2017
 * https://github.com/shaungrady/angular-http-etag
 * Module Format: Universal Module Definition
 * License: MIT
 */

(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("angular"));
	else if(typeof define === 'function' && define.amd)
		define(["angular"], factory);
	else if(typeof exports === 'object')
		exports["http-etag"] = factory(require("angular"));
	else
		root["http-etag"] = factory(root["angular"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_0__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 12);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_0__;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
var toString = Object.prototype.toString;

var isBuffer = typeof Buffer !== 'undefined' ? function isBuffer(obj) {
  return Buffer.isBuffer(obj);
} : function isBuffer() {
  // always return false in browsers
  return false;
};

var getKeys = typeof Object.keys === 'function' ? function getKeys(obj) {
  return Object.keys(obj);
} : function getKeys(obj) {
  var objType = typeof obj;

  if (obj === null || objType !== 'function' && objType !== 'object') {
    throw new TypeError('obj must be an Object');
  }

  var resultKeys = [],
      key = void 0;

  for (key in obj) {
    Object.prototype.hasOwnProperty.call(obj, key) && resultKeys.push(key);
  }

  return resultKeys;
};

var getSymbols = typeof Symbol === 'function' ? function getSymbols(obj) {
  return Object.getOwnPropertySymbols(obj);
} : function getSymbols() {
  // always return empty Array when Symbol is not supported
  return [];
};

// NOTE:
//
//   Array.prototype.indexOf is cannot find NaN (in Chrome)
//   Array.prototype.includes is can find NaN (in Chrome)
//
//   this function can find NaN, because use SameValue algorithm
function indexOf(array, s) {
  if (toString.call(array) !== '[object Array]') {
    throw new TypeError('array must be an Array');
  }

  var i = void 0,
      len = void 0,
      value = void 0;

  for (i = 0, len = array.length; i < len; ++i) {
    value = array[i];

    // NOTE:
    //
    //   it is SameValue algorithm
    //   http://stackoverflow.com/questions/27144277/comparing-a-variable-with-itself
    //
    // eslint-disable-next-line no-self-compare
    if (value === s || value !== value && s !== s) {
      return i;
    }
  }

  return -1;
}

exports.getKeys = getKeys;
exports.getSymbols = getSymbols;
exports.indexOf = indexOf;
exports.isBuffer = isBuffer;

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);


/* harmony default export */ __webpack_exports__["a"] = cacheAdaptersConfig;

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
        createCache: __WEBPACK_IMPORTED_MODULE_0_angular___default.a.noop,
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

          __WEBPACK_IMPORTED_MODULE_0_angular___default.a.forEach(localStorage, function (value, key) {
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
        createCache: __WEBPACK_IMPORTED_MODULE_0_angular___default.a.noop,
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

          __WEBPACK_IMPORTED_MODULE_0_angular___default.a.forEach(sessionStorage, function (value, key) {
            if (key.indexOf(keyPrefix) === 0) {
              sessionStorage.removeItem(key)
            }
          })
        }
      }
    })
}


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_object_keys__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_object_keys___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_object_keys__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_array_map__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_array_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_array_map__);




/* harmony default export */ __webpack_exports__["a"] = httpEtagHttpDecorator;

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
          httpConfig.headers = __WEBPACK_IMPORTED_MODULE_0_angular___default.a.extend({}, httpConfig.headers, {
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

      if (useLegacyPromiseExtensions) {
        httpPromise.cached = function httpEtagPromiseCached (callback) {
          if (rawCacheData && cacheInfo.cacheResponseData) {
            callback(cachedResponse, 'cached', undefined, httpConfig, itemCache)
          }
          return httpPromise
        }
      } else {
        httpPromise.cached = function deprecatedEtagPromiseCached () {
          throw new Error('The method `cached` on the promise returned from `$http` has been disabled in favor of `ifCached`.')
        }
      }

      httpPromise.ifCached = function httpEtagPromiseIfCached (callback) {
        if (rawCacheData && cacheInfo.cacheResponseData) {
          callback({
            data: cachedResponse,
            status: 'cached',
            headers: undefined,
            config: httpConfig
          }, itemCache)
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
  __WEBPACK_IMPORTED_MODULE_0_angular___default.a.forEach(cachableHttpMethods, function (httpMethod) {
    var method = httpMethod.toLowerCase()
    $httpDecorator[method] = function httpEtagHttpShortcutWrapper (url, config) {
      config = __WEBPACK_IMPORTED_MODULE_0_angular___default.a.extend({}, config, {
        method: httpMethod,
        url: url
      })

      return $httpDecorator.call($http, config)
    }
  })

  // Copy over all other properties and methods
  __WEBPACK_IMPORTED_MODULE_0_angular___default.a.forEach($http, function copyHttpPropertyToDectorator (value, key) {
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
    return obj ? __WEBPACK_IMPORTED_MODULE_2_array_map___default()(__WEBPACK_IMPORTED_MODULE_1_object_keys___default()(obj).sort(), function (key) {
      var val = obj[key]

      if (__WEBPACK_IMPORTED_MODULE_0_angular___default.a.isArray(val)) {
        return __WEBPACK_IMPORTED_MODULE_2_array_map___default()(val.sort(), function (val2) {
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


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = httpEtagInterceptorFactory;

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


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_deepcopy__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_deepcopy___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_deepcopy__);



/* harmony default export */ __webpack_exports__["a"] = httpEtagProvider;

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
    defaultEtagCacheConfig = __WEBPACK_IMPORTED_MODULE_0_angular___default.a.extend({}, defaultEtagCacheConfig, config)
    return httpEtagProvider
  }

  httpEtagProvider.getDefaultCacheConfig = function httpEtagGetDefaultCacheOptions () {
    return defaultEtagCacheConfig
  }

  httpEtagProvider.defineCache = function httpEtagDefineCache (cacheId, config) {
    config = __WEBPACK_IMPORTED_MODULE_0_angular___default.a.extend({}, defaultEtagCacheConfig, config, { id: cacheId })
    cacheDefinitions[cacheId] = config
    return httpEtagProvider
  }

  httpEtagProvider.defineCacheServiceAdapter = function httpEtagDefineCacheServiceAdapter (serviceName, config) {
    if (!config) throw new Error('Missing cache service adapter configuration')
    if (!config.methods) throw new Error('Missing cache service adapter configuration methods')
    __WEBPACK_IMPORTED_MODULE_0_angular___default.a.forEach(requiredAdapterMethods, function (method) {
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
    __WEBPACK_IMPORTED_MODULE_0_angular___default.a.forEach(cacheAdapters, function adaptCacheService (adapter, serviceName) {
      var service = services[serviceName] = window[serviceName] || $injector.get(serviceName)
      var adaptedService = adaptedServices[serviceName] = {}

      __WEBPACK_IMPORTED_MODULE_0_angular___default.a.forEach(serviceAdapterMethods, function (method) {
        adaptedService[method] = __WEBPACK_IMPORTED_MODULE_0_angular___default.a.bind({}, adapter.methods[method], service)
      })
    })

    // Instantiate caches and create adapted versions
    __WEBPACK_IMPORTED_MODULE_0_angular___default.a.forEach(cacheDefinitions, function adaptCache (config, cacheId) {
      adaptedServices[config.cacheService].createCache(cacheId, config)
      var cache = caches[cacheId] = adaptedServices[config.cacheService].getCache(cacheId)
      var adaptedCache = adaptedCaches[cacheId] = {}
      // Determine whether to perform deepcopying or not
      var serviceDeepCopies = cacheAdapters[config.cacheService].config.storesDeepCopies
      var deepCopy = !serviceDeepCopies && cacheDefinitions[cacheId].deepCopy
      var copy = function (value) {
        return deepCopy ? __WEBPACK_IMPORTED_MODULE_1_deepcopy___default()(value) : value
      }

      __WEBPACK_IMPORTED_MODULE_0_angular___default.a.forEach(cacheAdapterMethods, function (method) {
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

        adaptedCache[method] = __WEBPACK_IMPORTED_MODULE_0_angular___default.a.bind({}, (wrappedMethod || adapterMethod), cache)
        if (wrappedRawMethod) {
          adaptedCache['$' + method] = __WEBPACK_IMPORTED_MODULE_0_angular___default.a.bind({}, wrappedRawMethod, cache)
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

      __WEBPACK_IMPORTED_MODULE_0_angular___default.a.forEach(methodMappings, function mapCacheMethdodsToItemCache (methods) {
        itemCache[methods[0]] = __WEBPACK_IMPORTED_MODULE_0_angular___default.a.bind({}, cache[methods[1]], itemKey)
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
      __WEBPACK_IMPORTED_MODULE_0_angular___default.a.forEach(adaptedCaches, function (cache) {
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


/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = function (xs, f) {
    if (xs.map) return xs.map(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        var x = xs[i];
        if (hasOwn.call(xs, i)) res.push(f(x, i, xs));
    }
    return res;
};

var hasOwn = Object.prototype.hasOwnProperty;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(9);


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.copyValue = exports.copyCollection = exports.copy = void 0;

var _polyfill = __webpack_require__(1);

var toString = Object.prototype.toString;

function copy(target, customizer) {
  var resultValue = copyValue(target);

  if (resultValue !== null) {
    return resultValue;
  }

  return copyCollection(target, customizer);
}

function copyCollection(target, customizer) {
  if (typeof customizer !== 'function') {
    throw new TypeError('customizer is must be a Function');
  }

  if (typeof target === 'function') {
    var source = String(target);

    // NOTE:
    //
    //   https://gist.github.com/jdalton/5e34d890105aca44399f
    //
    //   - https://gist.github.com/jdalton/5e34d890105aca44399f#gistcomment-1283831
    //   - http://es5.github.io/#x15
    //
    //   native functions does not have prototype:
    //
    //       Object.toString.prototype  // => undefined
    //       (function() {}).prototype  // => {}
    //
    //   but cannot detect native constructor:
    //
    //       typeof Object     // => 'function'
    //       Object.prototype  // => {}
    //
    //   and cannot detect null binded function:
    //
    //       String(Math.abs)
    //         // => 'function abs() { [native code] }'
    //
    //     Firefox, Safari:
    //       String((function abs() {}).bind(null))
    //         // => 'function abs() { [native code] }'
    //
    //     Chrome:
    //       String((function abs() {}).bind(null))
    //         // => 'function () { [native code] }'
    if (/^\s*function\s*\S*\([^\)]*\)\s*{\s*\[native code\]\s*}/.test(source)) {
      // native function
      return target;
    } else {
      // user defined function
      return new Function('return ' + String(source))();
    }
  }

  var targetClass = toString.call(target);

  if (targetClass === '[object Array]') {
    return [];
  }

  if (targetClass === '[object Object]' && target.constructor === Object) {
    return {};
  }

  if (targetClass === '[object Date]') {
    // NOTE:
    //
    //   Firefox need to convert
    //
    //   Firefox:
    //     var date = new Date;
    //     +date;            // 1420909365967
    //     +new Date(date);  // 1420909365000
    //     +new Date(+date); // 1420909365967
    //
    //   Chrome:
    //     var date = new Date;
    //     +date;            // 1420909757913
    //     +new Date(date);  // 1420909757913
    //     +new Date(+date); // 1420909757913
    return new Date(target.getTime());
  }

  if (targetClass === '[object RegExp]') {
    // NOTE:
    //
    //   Chrome, Safari:
    //     (new RegExp).source => "(?:)"
    //
    //   Firefox:
    //     (new RegExp).source => ""
    //
    //   Chrome, Safari, Firefox:
    //     String(new RegExp) => "/(?:)/"
    var regexpText = String(target),
        slashIndex = regexpText.lastIndexOf('/');

    return new RegExp(regexpText.slice(1, slashIndex), regexpText.slice(slashIndex + 1));
  }

  if ((0, _polyfill.isBuffer)(target)) {
    var buffer = new Buffer(target.length);

    target.copy(buffer);

    return buffer;
  }

  var customizerResult = customizer(target);

  if (customizerResult !== void 0) {
    return customizerResult;
  }

  return null;
}

function copyValue(target) {
  var targetType = typeof target;

  // copy String, Number, Boolean, undefined and Symbol
  // without null and Function
  if (target !== null && targetType !== 'object' && targetType !== 'function') {
    return target;
  }

  return null;
}

exports.copy = copy;
exports.copyCollection = copyCollection;
exports.copyValue = copyValue;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _copy = __webpack_require__(8);

var _polyfill = __webpack_require__(1);

function defaultCustomizer(target) {
  return void 0;
}

function deepcopy(target) {
  var customizer = arguments.length <= 1 || arguments[1] === void 0 ? defaultCustomizer : arguments[1];

  if (target === null) {
    // copy null
    return null;
  }

  var resultValue = (0, _copy.copyValue)(target);

  if (resultValue !== null) {
    // copy some primitive types
    return resultValue;
  }

  var resultCollection = (0, _copy.copyCollection)(target, customizer),
      clone = resultCollection !== null ? resultCollection : target;

  var visited = [target],
      reference = [clone];

  // recursively copy from collection
  return recursiveCopy(target, customizer, clone, visited, reference);
}

function recursiveCopy(target, customizer, clone, visited, reference) {
  if (target === null) {
    // copy null
    return null;
  }

  var resultValue = (0, _copy.copyValue)(target);

  if (resultValue !== null) {
    // copy some primitive types
    return resultValue;
  }

  var keys = (0, _polyfill.getKeys)(target).concat((0, _polyfill.getSymbols)(target));

  var i = void 0,
      len = void 0;

  var key = void 0,
      value = void 0,
      index = void 0,
      resultCopy = void 0,
      result = void 0,
      ref = void 0;

  for (i = 0, len = keys.length; i < len; ++i) {
    key = keys[i];
    value = target[key];
    index = (0, _polyfill.indexOf)(visited, value);

    resultCopy = void 0;
    result = void 0;
    ref = void 0;

    if (index === -1) {
      resultCopy = (0, _copy.copy)(value, customizer);
      result = resultCopy !== null ? resultCopy : value;

      if (value !== null && /^(?:function|object)$/.test(typeof value)) {
        visited.push(value);
        reference.push(result);
      }
    } else {
      // circular reference
      ref = reference[index];
    }

    clone[key] = ref || recursiveCopy(value, customizer, result, visited, reference);
  }

  return clone;
}

exports['default'] = deepcopy;
module.exports = exports['default'];

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// modified from https://github.com/es-shims/es5-shim
var has = Object.prototype.hasOwnProperty;
var toStr = Object.prototype.toString;
var slice = Array.prototype.slice;
var isArgs = __webpack_require__(11);
var isEnumerable = Object.prototype.propertyIsEnumerable;
var hasDontEnumBug = !isEnumerable.call({ toString: null }, 'toString');
var hasProtoEnumBug = isEnumerable.call(function () {}, 'prototype');
var dontEnums = [
	'toString',
	'toLocaleString',
	'valueOf',
	'hasOwnProperty',
	'isPrototypeOf',
	'propertyIsEnumerable',
	'constructor'
];
var equalsConstructorPrototype = function (o) {
	var ctor = o.constructor;
	return ctor && ctor.prototype === o;
};
var excludedKeys = {
	$console: true,
	$external: true,
	$frame: true,
	$frameElement: true,
	$frames: true,
	$innerHeight: true,
	$innerWidth: true,
	$outerHeight: true,
	$outerWidth: true,
	$pageXOffset: true,
	$pageYOffset: true,
	$parent: true,
	$scrollLeft: true,
	$scrollTop: true,
	$scrollX: true,
	$scrollY: true,
	$self: true,
	$webkitIndexedDB: true,
	$webkitStorageInfo: true,
	$window: true
};
var hasAutomationEqualityBug = (function () {
	/* global window */
	if (typeof window === 'undefined') { return false; }
	for (var k in window) {
		try {
			if (!excludedKeys['$' + k] && has.call(window, k) && window[k] !== null && typeof window[k] === 'object') {
				try {
					equalsConstructorPrototype(window[k]);
				} catch (e) {
					return true;
				}
			}
		} catch (e) {
			return true;
		}
	}
	return false;
}());
var equalsConstructorPrototypeIfNotBuggy = function (o) {
	/* global window */
	if (typeof window === 'undefined' || !hasAutomationEqualityBug) {
		return equalsConstructorPrototype(o);
	}
	try {
		return equalsConstructorPrototype(o);
	} catch (e) {
		return false;
	}
};

var keysShim = function keys(object) {
	var isObject = object !== null && typeof object === 'object';
	var isFunction = toStr.call(object) === '[object Function]';
	var isArguments = isArgs(object);
	var isString = isObject && toStr.call(object) === '[object String]';
	var theKeys = [];

	if (!isObject && !isFunction && !isArguments) {
		throw new TypeError('Object.keys called on a non-object');
	}

	var skipProto = hasProtoEnumBug && isFunction;
	if (isString && object.length > 0 && !has.call(object, 0)) {
		for (var i = 0; i < object.length; ++i) {
			theKeys.push(String(i));
		}
	}

	if (isArguments && object.length > 0) {
		for (var j = 0; j < object.length; ++j) {
			theKeys.push(String(j));
		}
	} else {
		for (var name in object) {
			if (!(skipProto && name === 'prototype') && has.call(object, name)) {
				theKeys.push(String(name));
			}
		}
	}

	if (hasDontEnumBug) {
		var skipConstructor = equalsConstructorPrototypeIfNotBuggy(object);

		for (var k = 0; k < dontEnums.length; ++k) {
			if (!(skipConstructor && dontEnums[k] === 'constructor') && has.call(object, dontEnums[k])) {
				theKeys.push(dontEnums[k]);
			}
		}
	}
	return theKeys;
};

keysShim.shim = function shimObjectKeys() {
	if (Object.keys) {
		var keysWorksWithArguments = (function () {
			// Safari 5.0 bug
			return (Object.keys(arguments) || '').length === 2;
		}(1, 2));
		if (!keysWorksWithArguments) {
			var originalKeys = Object.keys;
			Object.keys = function keys(object) {
				if (isArgs(object)) {
					return originalKeys(slice.call(object));
				} else {
					return originalKeys(object);
				}
			};
		}
	} else {
		Object.keys = keysShim;
	}
	return Object.keys || keysShim;
};

module.exports = keysShim;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var toStr = Object.prototype.toString;

module.exports = function isArguments(value) {
	var str = toStr.call(value);
	var isArgs = str === '[object Arguments]';
	if (!isArgs) {
		isArgs = str !== '[object Array]' &&
			value !== null &&
			typeof value === 'object' &&
			typeof value.length === 'number' &&
			value.length >= 0 &&
			toStr.call(value.callee) === '[object Function]';
	}
	return isArgs;
};


/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__service__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__httpDecorator__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__httpInterceptor__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__cacheServiceAdapters__ = __webpack_require__(2);






/* harmony default export */ __webpack_exports__["default"] = __WEBPACK_IMPORTED_MODULE_0_angular___default.a
  .module('http-etag', [])
  .provider('httpEtag', __WEBPACK_IMPORTED_MODULE_1__service__["a" /* default */])
  .config(__WEBPACK_IMPORTED_MODULE_4__cacheServiceAdapters__["a" /* default */])
  .config(['$provide', '$httpProvider', function addHttpEtagInterceptor ($provide, $httpProvider) {
    __WEBPACK_IMPORTED_MODULE_2__httpDecorator__["a" /* default */].useLegacyPromiseExtensions =
      $httpProvider.useLegacyPromiseExtensions ||
      function useLegacyPromiseExtensions () {
        return __WEBPACK_IMPORTED_MODULE_0_angular___default.a.version.major === 1 && __WEBPACK_IMPORTED_MODULE_0_angular___default.a.version.minor < 6
      }
    $provide.decorator('$http', __WEBPACK_IMPORTED_MODULE_2__httpDecorator__["a" /* default */])
    $httpProvider.interceptors.push(__WEBPACK_IMPORTED_MODULE_3__httpInterceptor__["a" /* default */])
  }])
  .name;


/***/ })
/******/ ]);
});