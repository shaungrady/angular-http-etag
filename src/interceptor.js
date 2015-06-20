'use strict';

var angular = require('angular');
module.exports = httpEtagInterceptorFactory;

httpEtagInterceptorFactory.$inject = ['$q', '$cacheFactory', 'queryStringify'];

function httpEtagInterceptorFactory ($q, $cacheFactory, queryStringify) {
  var defaultCache = $cacheFactory('httpEtag');

  function buildUrlKey (url, params) {
    var queryString = queryStringify(params);
    url += ((url.indexOf('?') == -1) ? '?' : '&') + queryString;
    return url;
  }

  function getCacheFactoryData (cacheId, cacheKey) {
    if (angular.isDefined(cacheId) && angular.isDefined(cacheKey)) {
      var cache     = $cacheFactory.get(cacheId),
          cacheData = cache ? cache.get(cacheKey) : undefined;
      return cacheData;
    }
  }


  // Request
  function etagRequestInterceptor (config) {
    if (!config.etag || !(config.method == 'GET' || config.method == 'JSONP'))
      return config;

    var etag, key, cacheData;

    switch (typeof config.etag) {
      // Using user-provided cache
      case 'object':
        cacheData = getCacheFactoryData(config.etag.cache.id, config.etag.cache.key);
        etag      = angular.isObject(cacheData) ? cacheData.$$etag : undefined;
        break;

      // Using user-provided etag string, fall through to provide ETag caching
      case 'string':
        etag = config.etag;

      // Using default cache
      case 'boolean':
        key  = buildUrlKey(config.url, config.params);
        etag = etag || defaultCache.get(key);
        config.$$etagDefaultCacheKey = key;
    }

    if (etag)
      config.headers = angular.extend({}, config.headers, {
        'If-None-Match': etag
      });

    return config;
  }


  // Response
  function etagResponseInterceptor (response) {
    if (!response.config.etag)
      return response;

    var config = response.config,
        etag   = response.headers().etag,
        cache, cacheKey, cacheValue;

    switch (typeof config.etag) {
      case 'object':
        cache    = $cacheFactory.get(config.etag.cache.id);
        cacheKey = config.etag.cache.key;
        if (!cache || !angular.isObject(response.data))
          return response;
        response.data.$$etag = etag;
        cacheValue = response.data;
        break;

      case 'string':
      case 'boolean':
        cache      = defaultCache;
        cacheKey   = config.$$etagDefaultCacheKey;
        cacheValue = etag;
        delete config.$$etagDefaultCacheKey;
    }

    cache.put(cacheKey, cacheValue);

    return response;
  }


  // Response Error
  function etagResponseErrorInterceptor (rejection) {
    var etagConfig = rejection.config.etag,
        cacheData;

    if (rejection.status == 304 && etagConfig && etagConfig.cache) {


      cacheData = getCacheFactoryData(etagConfig.cache.id, etagConfig.cache.key);
      if (angular.isDefined(cacheData))
        rejection.data = cacheData;
    }

    return $q.reject(rejection);
  }


  return {
    request:       etagRequestInterceptor,
    response:      etagResponseInterceptor,
    responseError: etagResponseErrorInterceptor
  };
}
