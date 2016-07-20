(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.angularHttpEtag = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
module.exports = function (xs, f) {
    if (xs.map) return xs.map(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        var x = xs[i];
        if (hasOwn.call(xs, i)) res.push(f(x, i, xs));
    }
    return res;
};

var hasOwn = Object.prototype.hasOwnProperty;

},{}],2:[function(_dereq_,module,exports){
'use strict';

// modified from https://github.com/es-shims/es5-shim
var has = Object.prototype.hasOwnProperty;
var toStr = Object.prototype.toString;
var slice = Array.prototype.slice;
var isArgs = _dereq_('./isArguments');
var isEnumerable = Object.prototype.propertyIsEnumerable;
var hasDontEnumBug = !isEnumerable.call({ toString: null }, 'toString');
var hasProtoEnumBug = isEnumerable.call(function () {}, 'prototype');
var dontEnums = [
	'toString',
	'toLocaleString',
	'valueOf',
	'hasOwnProperty',
	'isPrototypeOf',
	'propertyIsEnumerable',
	'constructor'
];
var equalsConstructorPrototype = function (o) {
	var ctor = o.constructor;
	return ctor && ctor.prototype === o;
};
var excludedKeys = {
	$console: true,
	$external: true,
	$frame: true,
	$frameElement: true,
	$frames: true,
	$innerHeight: true,
	$innerWidth: true,
	$outerHeight: true,
	$outerWidth: true,
	$pageXOffset: true,
	$pageYOffset: true,
	$parent: true,
	$scrollLeft: true,
	$scrollTop: true,
	$scrollX: true,
	$scrollY: true,
	$self: true,
	$webkitIndexedDB: true,
	$webkitStorageInfo: true,
	$window: true
};
var hasAutomationEqualityBug = (function () {
	/* global window */
	if (typeof window === 'undefined') { return false; }
	for (var k in window) {
		try {
			if (!excludedKeys['$' + k] && has.call(window, k) && window[k] !== null && typeof window[k] === 'object') {
				try {
					equalsConstructorPrototype(window[k]);
				} catch (e) {
					return true;
				}
			}
		} catch (e) {
			return true;
		}
	}
	return false;
}());
var equalsConstructorPrototypeIfNotBuggy = function (o) {
	/* global window */
	if (typeof window === 'undefined' || !hasAutomationEqualityBug) {
		return equalsConstructorPrototype(o);
	}
	try {
		return equalsConstructorPrototype(o);
	} catch (e) {
		return false;
	}
};

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
		var skipConstructor = equalsConstructorPrototypeIfNotBuggy(object);

		for (var k = 0; k < dontEnums.length; ++k) {
			if (!(skipConstructor && dontEnums[k] === 'constructor') && has.call(object, dontEnums[k])) {
				theKeys.push(dontEnums[k]);
			}
		}
	}
	return theKeys;
};

keysShim.shim = function shimObjectKeys() {
	if (Object.keys) {
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
	} else {
		Object.keys = keysShim;
	}
	return Object.keys || keysShim;
};

module.exports = keysShim;

},{"./isArguments":3}],3:[function(_dereq_,module,exports){
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

},{}],4:[function(_dereq_,module,exports){
(function (global){
'use strict';

var angular    = (typeof window !== "undefined" ? window['angular'] : typeof global !== "undefined" ? global['angular'] : null);
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

var angular = (typeof window !== "undefined" ? window['angular'] : typeof global !== "undefined" ? global['angular'] : null);
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

var angular    = (typeof window !== "undefined" ? window['angular'] : typeof global !== "undefined" ? global['angular'] : null);
module.exports = httpEtagProvider;

function httpEtagProvider () {
  /*jshint validthis: true */
  var self             = this,
      caches           = {},
      cacheServiceName = '$cacheFactory',
      cacheIdPrefix    = 'etag-',
      defaultCacheId   = 'default';

  // Default cache
  caches[cacheIdPrefix + defaultCacheId] = {
    number: 25
  };

  self.cache = function httpEtagProviderCache (id, opts) {
    caches[cacheIdPrefix + id] = opts || {};
    return self;
  };


  self.$get = ['polyfills', '$injector', function (polyfills, $injector) {
    var cacheService = $injector.get(cacheServiceName);

    // Instantiate caches defined in provider
    angular.forEach(caches, function httpEtagCacheBuilder (opts, id) {
      cacheService(id, opts);
    });

    function httpEtagParseCacheKey (cacheId, url, params) {
      cacheId = getFullCacheId(cacheId);

      var keyParser = cacheService.get(cacheId).info().keyParser,
          key, queryString;

      if (angular.isFunction(keyParser))
        key = keyParser(url, params);

      // Failsafe
      if (angular.isUndefined(key)) {
        queryString = stringifyParams(params);
        key = url + ((url.indexOf('?') == -1) ? '?' : '&') + queryString;
      }

      return key;
    }

    // Abstract get/put operations for future support of different caching
    // plugins allowing for web storage
    function httpEtagGetCacheValue (id, key) {
      if (arguments.length == 1) {
          key = id;
          id  = true;
      }

      id = getFullCacheId(id);
      return cacheService.get(id).get(key);
    }

    function httpEtagPutCacheValue (id, key, value) {
      if (arguments.length == 2) {
          value = key;
          key   = id;
          id    = true;
      }

      id = getFullCacheId(id);
      cacheService.get(id).put(key, value);
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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],7:[function(_dereq_,module,exports){
(function (global){
'use strict';

var angular    = (typeof window !== "undefined" ? window['angular'] : typeof global !== "undefined" ? global['angular'] : null);
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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],8:[function(_dereq_,module,exports){
(function (global){
'use strict';

var angular     = (typeof window !== "undefined" ? window['angular'] : typeof global !== "undefined" ? global['angular'] : null);
var objectKeys  = _dereq_('object-keys');
var arrayMap    = _dereq_('array-map');

var provider    = _dereq_('./provider');
var interceptor = _dereq_('./interceptor');
var config      = _dereq_('./config');
var run         = _dereq_('./run');

module.exports = angular
  .module('http-etag', [])
  .value('polyfills', {
    keys: objectKeys,
    map: arrayMap
  })
  .provider('httpEtag', provider)
  .factory('httpEtagInterceptor', interceptor)
  .config(config)
  .run(run)

  .name;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./config":4,"./interceptor":5,"./provider":6,"./run":7,"array-map":1,"object-keys":2}]},{},[8])(8)
});