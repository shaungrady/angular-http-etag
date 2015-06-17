'use strict';

var angular = require('angular');
module.exports = httpEtagInterceptorFactory;

httpEtagInterceptorFactory.$inject = ['queryStringify'];

function httpEtagInterceptorFactory (queryStringify) {
  var etagCache = {};

  function buildUrl (url, params) {
    var queryString = queryStringify(params);
    url += ((url.indexOf('?') == -1) ? '?' : '&') + queryString;
    return url;
  }


  // Determines if an etag has already been seen for this request config and,
  // if it has, sets 'If-None-Match' header to that etag value.
  function requestInterceptor (config) {
    if (config.etag === true && (config.method == 'GET' || config.method == 'JSONP')) {
      var queryString = queryStringify(config.params);
      var url = buildUrl(config.url, config.params);

      if (etagCache[url])
        config.headers = angular.extend({}, config.headers, {
          'If-None-Match': etagCache[url]
        });
    }
    return config;
  }


  // If configured to use etags, store the returned etag in memory.
  function responseInterceptor (response) {
    if (response.config.etag === true) {
      var url = buildUrl(response.config.url, response.config.params);
      etagCache[url] = response.headers().etag;
    }

    return response;
  }


  return {
    request:  requestInterceptor,
    response: responseInterceptor
  };
}
