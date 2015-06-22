'use strict';

var angular    = require('angular');
module.exports = httpEtagProvider;

function httpEtagProvider () {
  var self           = this,
      caches         = {},
      cacheService   = '$cacheFactory',
      defaultCacheId = 'httpEtagDefault';

  // Default cache
  caches[defaultCacheId] = {
    number: 25
  };

  self.cache = function httpEtagProviderCache (id, opts) {
    caches[id] = opts || {};
    return self;
  };


  self.$get = ['$cacheFactory', function ($cacheFactory) {

    angular.forEach(caches, function httpEtagCacheBuilder (opts, id) {
      $cacheFactory(id, opts);
    });

    // Abstract get/put operations for future support
    // of different caching plugins allowing for web storage.
    function httpEtagGetCacheValue (id, key) {
      id = id || defaultCacheId;
      $cacheFactory.get(id).get(key);
    }

    function httpEtagPutCacheValue (id, key) {
      id = id || defaultCacheId;
      $cacheFactory.get(id).put(key);
    }

    return {
      cacheGet: httpEtagGetCacheValue,
      cachePut: httpEtagPutCacheValue
    };

  }];
}
