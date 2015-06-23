(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.angularHttpEtags = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
'use strict';

// modified from https://github.com/es-shims/es5-shim
var has = Object.prototype.hasOwnProperty;
var toStr = Object.prototype.toString;
var slice = Array.prototype.slice;
var isArgs = _dereq_('./isArguments');
var hasDontEnumBug = !({ 'toString': null }).propertyIsEnumerable('toString');
var hasProtoEnumBug = function () {}.propertyIsEnumerable('prototype');
var dontEnums = [
	'toString',
	'toLocaleString',
	'valueOf',
	'hasOwnProperty',
	'isPrototypeOf',
	'propertyIsEnumerable',
	'constructor'
];

var keysShim = function keys(object) {
	var isObject = object !== null && typeof object === 'object';
	var isFunction = toStr.call(object) === '[object Function]';
	var isArguments = isArgs(object);
	var isString = isObject && toStr.call(object) === '[object String]';
	var theKeys = [];

	if (!isObject && !isFunction && !isArguments) {
		throw new TypeError('Object.keys called on a non-object');
	}

	var skipProto = hasProtoEnumBug && isFunction;
	if (isString && object.length > 0 && !has.call(object, 0)) {
		for (var i = 0; i < object.length; ++i) {
			theKeys.push(String(i));
		}
	}

	if (isArguments && object.length > 0) {
		for (var j = 0; j < object.length; ++j) {
			theKeys.push(String(j));
		}
	} else {
		for (var name in object) {
			if (!(skipProto && name === 'prototype') && has.call(object, name)) {
				theKeys.push(String(name));
			}
		}
	}

	if (hasDontEnumBug) {
		var ctor = object.constructor;
		var skipConstructor = ctor && ctor.prototype === object;

		for (var k = 0; k < dontEnums.length; ++k) {
			if (!(skipConstructor && dontEnums[k] === 'constructor') && has.call(object, dontEnums[k])) {
				theKeys.push(dontEnums[k]);
			}
		}
	}
	return theKeys;
};

keysShim.shim = function shimObjectKeys() {
	if (!Object.keys) {
		Object.keys = keysShim;
	} else {
		var keysWorksWithArguments = (function () {
			// Safari 5.0 bug
			return (Object.keys(arguments) || '').length === 2;
		}(1, 2));
		if (!keysWorksWithArguments) {
			var originalKeys = Object.keys;
			Object.keys = function keys(object) {
				if (isArgs(object)) {
					return originalKeys(slice.call(object));
				} else {
					return originalKeys(object);
				}
			};
		}
	}
	return Object.keys || keysShim;
};

module.exports = keysShim;

},{"./isArguments":2}],2:[function(_dereq_,module,exports){
'use strict';

var toStr = Object.prototype.toString;

module.exports = function isArguments(value) {
	var str = toStr.call(value);
	var isArgs = str === '[object Arguments]';
	if (!isArgs) {
		isArgs = str !== '[object Array]' &&
			value !== null &&
			typeof value === 'object' &&
			typeof value.length === 'number' &&
			value.length >= 0 &&
			toStr.call(value.callee) === '[object Function]';
	}
	return isArgs;
};

},{}],3:[function(_dereq_,module,exports){
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

},{}],4:[function(_dereq_,module,exports){
(function (global){
'use strict';

var angular    = (typeof window !== "undefined" ? window.angular : typeof global !== "undefined" ? global.angular : null);
module.exports = httpEtagModuleConfig;

httpEtagModuleConfig.$inject = ['$provide', '$httpProvider'];

function httpEtagModuleConfig ($provide, $httpProvider) {
  $httpProvider.interceptors.push('httpEtagInterceptor');
  // Temporary property for use in run block
  angular.module('http-etag')._$provide = $provide;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],5:[function(_dereq_,module,exports){
(function (global){
'use strict';

var angular = (typeof window !== "undefined" ? window.angular : typeof global !== "undefined" ? global.angular : null);
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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],6:[function(_dereq_,module,exports){
(function (global){
'use strict';

var angular    = (typeof window !== "undefined" ? window.angular : typeof global !== "undefined" ? global.angular : null);
module.exports = httpEtagProvider;

function httpEtagProvider () {
  var self             = this,
      caches           = {},
      cacheServiceName = '$cacheFactory',
      cacheIdPrefix    = 'etag-',
      defaultCacheId   = cacheIdPrefix + 'default';

  // Default cache
  caches[defaultCacheId] = {
    number: 25
  };

  self.cache = function httpEtagProviderCache (id, opts) {
    caches[cacheIdPrefix + id] = opts || {};
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
      id = id === true ? defaultCacheId : cacheIdPrefix + id;
      return cacheService.get(id).get(key);
    }

    function httpEtagPutCacheValue (id, key, value) {
      id = id === true ? defaultCacheId : cacheIdPrefix + id;
      cacheService.get(id).put(key, value);
    }

    return {
      getCacheKey: httpEtagGetCacheKey,
      cacheGet:    httpEtagGetCacheValue,
      cachePut:    httpEtagPutCacheValue
    };

  }];
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],7:[function(_dereq_,module,exports){
(function (global){
'use strict';

var angular    = (typeof window !== "undefined" ? window.angular : typeof global !== "undefined" ? global.angular : null);
module.exports = httpEtagModuleRun;

httpEtagModuleRun.$inject = ['httpEtag', 'objectKeys'];

function httpEtagModuleRun (httpEtag, objectKeys) {
  var $provide = angular.module('http-etag')._$provide;
  delete angular.module('http-etag')._$provide;

  $provide.decorator('$http', function ($delegate) {
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
    angular.forEach(objectKeys($http), function (key) {
      if (angular.isFunction($http[key]))
        http[key] = angular.bind(key, httpMethod);
    });

    return http;
  });

}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],8:[function(_dereq_,module,exports){
(function (global){
'use strict';

var angular     = (typeof window !== "undefined" ? window.angular : typeof global !== "undefined" ? global.angular : null);
var objectKeys  = _dereq_('object-keys');
var queryString = _dereq_('query-string');

var provider    = _dereq_('./provider');
var interceptor = _dereq_('./interceptor');
var config      = _dereq_('./config');
var run         = _dereq_('./run');

module.exports = angular
  .module('http-etag', [])
  
  .value('objectKeys', objectKeys)
  .value('queryStringify', queryString.stringify)

  .provider('httpEtag', provider)
  .factory('httpEtagInterceptor', interceptor)
  .config(config)
  .run(run)

  .name;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./config":4,"./interceptor":5,"./provider":6,"./run":7,"object-keys":1,"query-string":3}]},{},[8])(8)
});