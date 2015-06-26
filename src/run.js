'use strict';

var angular    = require('angular');
module.exports = httpEtagModuleRun;

httpEtagModuleRun.$inject = ['httpEtag', 'polyfills'];

function httpEtagModuleRun (httpEtag, polyfills) {
  var $provide = angular.module('http-etag')._$provide;
  delete angular.module('http-etag')._$provide;

  $provide.decorator('$http', ['$delegate', function ($delegate) {
    var $http = $delegate,
        http, httpMethod;

    // TODO: DRY up http, httpMethod

    http = function httpEtagHttpWrapper (config) {
      var isEtagReq = config.etag && (config.method == 'GET' || config.method == 'JSONP'),
          cacheKey, cacheValue, etag, promise;

      if (isEtagReq) {
        config.etagCacheKey =
        cacheKey   = httpEtag.getCacheKey(config.url, config.params);
        cacheValue = httpEtag.cacheGet(config.etag, cacheKey);
        etag       = cacheValue ? cacheValue.etag : undefined;

        if (etag)
          config.headers = angular.extend({}, config.headers, {
            'If-None-Match': etag
          });
      }

      promise = $http.apply($http, arguments);

      if (isEtagReq)
        promise.cache = function (fn) {
          if (cacheValue)
            fn(cacheValue.data, cacheKey);
          return promise;
        };

      return promise;
    };


    httpMethod = function httpEtagHttpMethodWrapper (url, config) {
      config = config || {};

      var method    = this,
          isEtagReq = config.etag && (method == 'get' || method == 'jsonp'),
          cacheKey, cacheValue, etag, promise;

      if (isEtagReq) {
        config.etagCacheKey =
        cacheKey   = httpEtag.getCacheKey(url, config.params);
        cacheValue = httpEtag.cacheGet(config.etag, cacheKey);
        etag       = cacheValue ? cacheValue.etag : undefined;

        if (etag)
          config.headers = angular.extend({}, config.headers, {
            'If-None-Match': etag
          });
      }

      promise = $http[method].apply($http, arguments);

      if (isEtagReq)
        promise.cache = function (fn) {
          if (cacheValue)
            fn(cacheValue.data, cacheKey);
          return promise;
        };

      return promise;
    };


    // Wrap all the shortcut methods
    angular.forEach(polyfills.keys($http), function (key) {
      if (angular.isFunction($http[key]))
        http[key] = angular.bind(key, httpMethod);
    });

    return http;
  }]);

}
