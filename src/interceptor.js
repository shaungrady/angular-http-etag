'use strict';

var angular = require('angular');
module.exports = httpEtagInterceptorFactory;

httpEtagInterceptorFactory.$inject = ['httpEtag'];

function httpEtagInterceptorFactory (httpEtag) {

  function responseInterceptor (response) {
    var config   = response.config,
        cacheKey = config.etagCacheKey;

    if (cacheKey)
      httpEtag.cachePut(config.etag, cacheKey, {
        data: response.data,
        etag: response.headers().etag
      });

    return response;
  }

  return { response: responseInterceptor };
}
