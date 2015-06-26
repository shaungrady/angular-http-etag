'use strict';

var angular    = require('angular');
module.exports = httpEtagProvider;

function httpEtagProvider () {
  /*jshint validthis: true */
  var self             = this,
      caches           = {},
      cacheServiceName = '$cacheFactory',
      cacheIdPrefix    = 'etag-',
      defaultCacheId   = 'default';

  // Default cache
  caches[cacheIdPrefix + defaultCacheId] = {
    number: 25
  };

  self.cache = function httpEtagProviderCache (id, opts) {
    caches[cacheIdPrefix + id] = opts || {};
    return self;
  };


  self.$get = ['polyfills', '$injector', function (polyfills, $injector) {
    var cacheService = $injector.get(cacheServiceName);

    // Instantiate caches defined in provider
    angular.forEach(caches, function httpEtagCacheBuilder (opts, id) {
      cacheService(id, opts);
    });

    function httpEtagParseCacheKey (cacheId, url, params) {
      cacheId = getFullCacheId(cacheId);

      var keyParser = cacheService.get(cacheId).info().keyParser,
          key, queryString;

      if (angular.isFunction(keyParser))
        key = keyParser(url, params);

      // Failsafe
      if (angular.isUndefined(key)) {
        queryString = stringifyParams(params);
        key = url + ((url.indexOf('?') == -1) ? '?' : '&') + queryString;
      }

      return key;
    }

    // Abstract get/put operations for future support of different caching
    // plugins allowing for web storage
    function httpEtagGetCacheValue (id, key) {
      if (arguments.length == 1) {
          key = id;
          id  = true;
      }

      id = getFullCacheId(id);
      return cacheService.get(id).get(key);
    }

    function httpEtagPutCacheValue (id, key, value) {
      if (arguments.length == 2) {
          value = key;
          key   = id;
          id    = true;
      }

      id = getFullCacheId(id);
      cacheService.get(id).put(key, value);
    }

    return {
      _parseCacheKey: httpEtagParseCacheKey,
      cacheGet: httpEtagGetCacheValue,
      cachePut: httpEtagPutCacheValue
    };


    // Helpers
    //////////

    // Based on npm query-string
    function stringifyParams (obj) {
      return obj ? polyfills.map(polyfills.keys(obj).sort(), function (key) {
        var val = obj[key];

        if (angular.isArray(val)) {
          return polyfills.map(val.sort(), function (val2) {
            return encodeURIComponent(key) + '=' + encodeURIComponent(val2);
          }).join('&');
        }

        return encodeURIComponent(key) + '=' + encodeURIComponent(val);
      }).join('&') : '';
    }

    function getFullCacheId (id) {
      return cacheIdPrefix + (id === true ? defaultCacheId : id);
    }

  }];
}
