'use strict'

var angular = require('angular')
module.exports = httpEtagHttpDecorator

httpEtagHttpDecorator.$inject = ['$delegate', 'httpEtag', 'polyfills']

function httpEtagHttpDecorator ($delegate, httpEtag, polyfills) {
  var $http = $delegate
  var cachableHttpMethods = [
    'GET',
    'JSONP'
  ]
  var $httpShortcutMethods = [
    'get',
    'head',
    'post',
    'put',
    'delete',
    'jsonp',
    'patch'
  ]

  function processHttpConfigEtagValue (httpConfig) {
    var etagValue = httpConfig.etag
    var etagValueType = typeof etagValue
    var etagCacheConfig = {}

    if (etagValueType === 'object') {
      etagCacheConfig.id = etagValue.id
      etagCacheConfig.itemKey = etagValue.itemKey || generateCacheItemKey(httpConfig)
    } else if (etagValueType === 'string') {
      etagCacheConfig.id = etagValue
      etagCacheConfig.itemKey = generateCacheItemKey(httpConfig)
    } else if (etagValue === true) {
      // Undefined cacheId will use the default cacheId as defined in provider
      etagCacheConfig.itemKey = generateCacheItemKey(httpConfig)
    }
    return etagCacheConfig
  }

  function httpDecorator (httpConfig) {
    var isCachable = httpConfig.etag && cachableHttpMethods.indexOf(httpConfig.method) >= 0
    var etagCacheConfig, itemCache, cachedData, cachedResponse, cachedEtag, httpPromise

    if (isCachable) {
      etagCacheConfig = processHttpConfigEtagValue(httpConfig)
      itemCache = httpEtag.getItemCache(etagCacheConfig.id, etagCacheConfig.itemKey)
      cachedData = itemCache.get()
      cachedEtag = cachedData && cachedData.etagHeader
      cachedResponse = cachedEtag && cachedData.data

      // Allow easy access to cache in interceptor
      httpConfig.$$_itemCache = itemCache

      if (cachedEtag) {
        httpConfig.headers = angular.extend({}, httpConfig.headers, {
          'If-None-Match': cachedEtag
        })
      }
    }

    httpPromise = $http.apply($http, arguments)

    httpPromise.cached = function (callback) {
      if (isCachable && cachedData) callback(cachedResponse, undefined, undefined, httpConfig, itemCache)
      return httpPromise
    }

    return httpPromise
  }

  // Wrap shortcut methods
  angular.forEach($httpShortcutMethods, function (method) {
    var httpMethod = method.toUpperCase()
    var isCachable = cachableHttpMethods.indexOf(httpMethod) >= 0
    var shortcutMethod

    if (!isCachable) shortcutMethod = $http[method]
    else {
      shortcutMethod = function httpEtagHttpShortcutWrapper (url, config) {
        config = angular.extend({}, config, {
          method: httpMethod,
          url: url
        })

        return httpDecorator.call($http, config)
      }
    }
    httpDecorator[method] = shortcutMethod
  })

  /**
   * HELPERS
   */

  function generateCacheItemKey (httpConfig) {
    var url = httpConfig.url
    var params = stringifyParams(httpConfig.params)
    return url + (url.indexOf('?') > 0 ? '&' : '?') + params
  }

  // Based on npm package "query-string"
  function stringifyParams (obj) {
    return obj ? polyfills.map(polyfills.keys(obj).sort(), function (key) {
      var val = obj[key]

      if (angular.isArray(val)) {
        return polyfills.map(val.sort(), function (val2) {
          return encodeURIComponent(key) + '=' + encodeURIComponent(val2)
        }).join('&')
      }

      return encodeURIComponent(key) + '=' + encodeURIComponent(val)
    }).join('&') : ''
  }

  return httpDecorator
}
