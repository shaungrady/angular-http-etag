'use strict';

var angular = require('angular');
module.exports = httpEtagInterceptorFactory;

httpEtagInterceptorFactory.$inject = ['$cacheFactory', 'queryStringify'];

function httpEtagInterceptorFactory ($cacheFactory, queryStringify) {
  var defaultCache = $cacheFactory('httpEtag');

  function buildUrlKey (url, params) {
    var queryString = queryStringify(params);
    url += ((url.indexOf('?') == -1) ? '?' : '&') + queryString;
    return url;
  }


  // Request
  function requestInterceptor (config) {
    if (!config.etag || !(config.method == 'GET' || config.method == 'JSONP'))
      return config;

    var etag, key, cache, cacheData;

    switch (typeof config.etag) {
      // Using user-provided cache
      case 'object':
        cache     = $cacheFactory.get(config.etag.cache.id);
        cacheData = cache ? cache.get(config.etag.cache.key) : undefined;
        etag      = typeof(cacheData) == 'object' ? cacheData.$$etag : undefined;
        break;

      // Using user-provided etag string, fall through to provide caching
      case 'string':
        etag = config.etag;

      // Using default cache
      case 'boolean':
        key  = buildUrlKey(config.url, config.params);
        etag = etag || defaultCache.get(key);
        config.$$etagCacheKey = key;
    }

    if (etag)
      config.headers = angular.extend({}, config.headers, {
        'If-None-Match': etag
      });

    return config;
  }


  // Response
  function responseInterceptor (response) {
    if (!response.config.etag)
      return response;

    var config = response.config,
        etag   = response.headers().etag,
        cache, cacheKey, cacheValue;

    switch (typeof config.etag) {
      case 'object':
        cache    = $cacheFactory.get(config.etag.cache.id);
        cacheKey = config.etag.cache.key;
        if (!cache || typeof(response.data) != 'object')
          return response;
        response.data.$$etag = etag;
        cacheValue = response.data;
        break;

      case 'string':
      case 'boolean':
        cache      = defaultCache;
        cacheKey   = config.$$etagCacheKey;
        cacheValue = etag;
        delete config.$$etagCacheKey;
    }

    cache.put(cacheKey, cacheValue);

    return response;
  }


  return {
    request:  requestInterceptor,
    response: responseInterceptor
  };
}
