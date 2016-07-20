'use strict';

var angular    = require('angular');
module.exports = httpEtagModuleRun;

function httpEtagModuleRun () {
  var $provide = angular.module('http-etag')._$provide;
  delete angular.module('http-etag')._$provide;

  $provide.decorator('$http', ['$delegate', 'httpEtag', 'polyfills',
       function ($delegate, httpEtag, polyfills) {

    var $http = $delegate,
        http, httpMethod;

    // TODO: DRY up http, httpMethod

    http = function httpEtagHttpWrapper (config) {
      var isEtagReq = config.etag && (config.method == 'GET' || config.method == 'JSONP'),
          cacheKey, cacheValue, etag, promise;

      if (isEtagReq) {
        config.etagCacheKey =
        cacheKey   = httpEtag._parseCacheKey(config.etag, config.url, config.params);
        cacheValue = httpEtag.cacheGet(config.etag, cacheKey);
        etag       = cacheValue ? cacheValue.etag : undefined;

        if (etag) {
          config.headers = angular.extend({}, config.headers, {
            'If-None-Match': etag
          });
        }
      }

      promise = $http.apply($http, arguments);

      promise.cache = function (fn) {
        if (isEtagReq && cacheValue) fn(cacheValue.data, undefined, undefined, config, true);
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
        cacheKey   = httpEtag._parseCacheKey(config.etag, url, config.params);
        cacheValue = httpEtag.cacheGet(config.etag, cacheKey);
        etag       = cacheValue ? cacheValue.etag : undefined;

        if (etag)
          config.headers = angular.extend({}, config.headers, {
            'If-None-Match': etag
          });
      }

      promise = $http[method].apply($http, arguments);

      promise.cache = function (fn) {
        if (isEtagReq && cacheValue) fn(cacheValue.data, undefined, undefined, config, true);
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
