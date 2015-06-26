'use strict';

var angular    = require('angular');
module.exports = httpEtagProvider;

function httpEtagProvider () {
  /*jshint validthis: true */
  var self             = this,
      caches           = {},
      cacheServiceName = '$cacheFactory',
      cacheIdPrefix    = 'etag-',
      defaultCacheId   = cacheIdPrefix + 'default';

  // Default cache
  caches[defaultCacheId] = {
    number: 25
  };

  self.cache = function httpEtagProviderCache (id, opts) {
    caches[cacheIdPrefix + id] = opts || {};
    return self;
  };


  self.$get = ['polyfills', '$injector', function (polyfills, $injector) {
    var cacheService = $injector.get(cacheServiceName);

    angular.forEach(caches, function httpEtagCacheBuilder (opts, id) {
      cacheService(id, opts);
    });

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

    function httpEtagGetCacheKey (url, params) {
      var queryString = stringifyParams(params);
      url += ((url.indexOf('?') == -1) ? '?' : '&') + queryString;
      return url;
    }

    // Abstract get/put operations for future support
    // of different caching plugins allowing for web storage.
    function httpEtagGetCacheValue (id, key) {
      id = id === true ? defaultCacheId : cacheIdPrefix + id;
      return cacheService.get(id).get(key);
    }

    function httpEtagPutCacheValue (id, key, value) {
      id = id === true ? defaultCacheId : cacheIdPrefix + id;
      cacheService.get(id).put(key, value);
    }

    return {
      getCacheKey: httpEtagGetCacheKey,
      cacheGet:    httpEtagGetCacheValue,
      cachePut:    httpEtagPutCacheValue
    };

  }];
}
