'use strict';

var angular    = require('angular');
module.exports = httpEtagProvider;

function httpEtagProvider () {
  /*jshint validthis: true */
  var self                = this,
      caches              = {},
      defaultCacheService = '$cacheFactory',
      cacheIdPrefix       = 'etag-',
      defaultCacheId      = 'default';

  self.cache = function httpEtagProviderCache (id, opts) {
    caches[cacheIdPrefix + id] = angular.isObject(opts) ? opts : {};
    return self;
  };

  self.setDefaultCacheService = function httpEtagProviderSetDefaultCacheService (serviceName) {
    if (angular.isString(serviceName))
      defaultCacheService = serviceName;
    return self;
  };

  // Default cache
  self.cache('default', { number: 25 });

  self.$get = ['polyfills', '$injector', function (polyfills, $injector) {
    var cacheServices = {};

    // Instantiate caches defined in provider
    angular.forEach(caches, function httpEtagCacheBuilder (opts, id) {
      var config = caches[id] = angular.extend({ cacheService: defaultCacheService }, opts),
          cacheServiceName    = config.cacheService,
          cacheService        = cacheServices[cacheServiceName];

      if (!cacheService)
        cacheServices[cacheServiceName] =
        cacheService = $injector.get(cacheServiceName);

      switch (cacheServiceName) {
        // ngStorage
        case '$localStorage':
        case '$sessionStorage':
          break;
        // $cacheFactory, angular-cache
        default:
          cacheService(id, config);
      }
    });

    function httpEtagParseCacheKey (cacheId, url, params) {
      cacheId = getFullCacheId(cacheId);

      var keyParser = caches[cacheId].keyParser,
          key, queryString;

      if (angular.isFunction(keyParser))
        key = keyParser(url, params);

      // Failsafe
      if (!angular.isString(key) && !angular.isNumber(key)) {
        queryString = stringifyParams(params);
        key = url + ((url.indexOf('?') == -1) ? '?' : '&') + queryString;
      }

      return key;
    }

    // Get
    function httpEtagGetCacheValue (id, key) {
      if (arguments.length == 1) {
        key = id;
        id  = true;
      }

      id = getFullCacheId(id);

      var cacheServiceName = caches[id].cacheService,
          cacheService     = cacheServices[cacheServiceName];

      switch (cacheServiceName) {
        // ngStorage
        case '$localStorage':
        case '$sessionStorage':
          return cacheService[id +'-'+ key];
        // $cacheFactory, angular-cache
        default:
          return cacheService.get(id).get(key);
      }
    }

    // Put
    function httpEtagPutCacheValue (id, key, value) {
      if (arguments.length == 2) {
        value = key;
        key   = id;
        id    = true;
      }

      id = getFullCacheId(id);

      var cacheServiceName = caches[id].cacheService,
          cacheService     = cacheServices[cacheServiceName];

      switch (cacheServiceName) {
        // ngStorage
        case '$localStorage':
        case '$sessionStorage':
          cacheService[id +'-'+ key] = value;
          break;
        // $cacheFactory, angular-cache
        default:
          cacheService.get(id).put(key, value);
      }
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
