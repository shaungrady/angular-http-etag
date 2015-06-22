'use strict';

var angular    = require('angular');
module.exports = httpEtagProvider;

function httpEtagProvider () {
  var self             = this,
      caches           = {},
      cacheServiceName = '$cacheFactory',
      defaultCacheId   = 'httpEtagDefault';

  // Default cache
  caches[defaultCacheId] = {
    number: 25
  };

  self.cache = function httpEtagProviderCache (id, opts) {
    caches[id] = opts || {};
    return self;
  };


  self.$get = [cacheServiceName, 'queryStringify', function (cacheService, queryStringify) {

    angular.forEach(caches, function httpEtagCacheBuilder (opts, id) {
      cacheService(id, opts);
    });

    function httpEtagGetCacheKey (url, params) {
      var queryString = queryStringify(params);
      url += ((url.indexOf('?') == -1) ? '?' : '&') + queryString;
      return url;
    }

    // Abstract get/put operations for future support
    // of different caching plugins allowing for web storage.
    function httpEtagGetCacheValue (id, key) {
      id = id === true ? defaultCacheId : id;
      return cacheService.get(id).get(key);
    }

    function httpEtagPutCacheValue (id, key, value) {
      id = id === true ? defaultCacheId : id;
      cacheService.get(id).put(key, value);
    }

    return {
      getCacheKey: httpEtagGetCacheKey,
      cacheGet:    httpEtagGetCacheValue,
      cachePut:    httpEtagPutCacheValue
    };

  }];
}
