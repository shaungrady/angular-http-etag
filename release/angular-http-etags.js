(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.angularHttpEtags = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
'use strict';

exports.extract = function (maybeUrl) {
	return maybeUrl.split('?')[1] || '';
};

exports.parse = function (str) {
	if (typeof str !== 'string') {
		return {};
	}

	str = str.trim().replace(/^(\?|#|&)/, '');

	if (!str) {
		return {};
	}

	return str.split('&').reduce(function (ret, param) {
		var parts = param.replace(/\+/g, ' ').split('=');
		var key = parts[0];
		var val = parts[1];

		key = decodeURIComponent(key);
		// missing `=` should be `null`:
		// http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
		val = val === undefined ? null : decodeURIComponent(val);

		if (!ret.hasOwnProperty(key)) {
			ret[key] = val;
		} else if (Array.isArray(ret[key])) {
			ret[key].push(val);
		} else {
			ret[key] = [ret[key], val];
		}

		return ret;
	}, {});
};

exports.stringify = function (obj) {
	return obj ? Object.keys(obj).sort().map(function (key) {
		var val = obj[key];

		if (Array.isArray(val)) {
			return val.sort().map(function (val2) {
				return encodeURIComponent(key) + '=' + encodeURIComponent(val2);
			}).join('&');
		}

		return encodeURIComponent(key) + '=' + encodeURIComponent(val);
	}).join('&') : '';
};

},{}],2:[function(_dereq_,module,exports){
'use strict';

module.exports = httpEtagModuleConfig;

httpEtagModuleConfig.$inject = ['$httpProvider'];

function httpEtagModuleConfig ($httpProvider) {
  $httpProvider.interceptors.push('httpEtagInterceptor');
}

},{}],3:[function(_dereq_,module,exports){
(function (global){
'use strict';

var angular = (typeof window !== "undefined" ? window.angular : typeof global !== "undefined" ? global.angular : null);
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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],4:[function(_dereq_,module,exports){
(function (global){
'use strict';

var angular     = (typeof window !== "undefined" ? window.angular : typeof global !== "undefined" ? global.angular : null);
var queryString = _dereq_('query-string');
var interceptor = _dereq_('./interceptor');
var config      = _dereq_('./config');

module.exports = angular
  .module('http-etag', [])
  .value('queryStringify', queryString.stringify)
  .factory('httpEtagInterceptor', interceptor)
  .config(config)
  .name;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./config":2,"./interceptor":3,"query-string":1}]},{},[4])(4)
});