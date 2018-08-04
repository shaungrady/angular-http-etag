/**
 * angular-http-etag v2.0.18
 * Shaun Grady (http://shaungrady.com), 2018
 * https://github.com/shaungrady/angular-http-etag
 * Module Format: Universal Module Definition
 * License: MIT
 */

(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("angular"));
	else if(typeof define === 'function' && define.amd)
		define(["angular"], factory);
	else if(typeof exports === 'object')
		exports["http-etag"] = factory(require("angular"));
	else
		root["http-etag"] = factory(root["angular"]);
})(window, function(__WEBPACK_EXTERNAL_MODULE__0__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__0__;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

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


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {(function (global, factory) {
	 true ? module.exports = factory() :
	undefined;
}(this, (function () { 'use strict';

/* !
 * type-detect
 * Copyright(c) 2013 jake luer <jake@alogicalparadox.com>
 * MIT Licensed
 */
var promiseExists = typeof Promise === 'function';

/* eslint-disable no-undef */
var globalObject = typeof self === 'object' ? self : global; // eslint-disable-line id-blacklist

var symbolExists = typeof Symbol !== 'undefined';
var mapExists = typeof Map !== 'undefined';
var setExists = typeof Set !== 'undefined';
var weakMapExists = typeof WeakMap !== 'undefined';
var weakSetExists = typeof WeakSet !== 'undefined';
var dataViewExists = typeof DataView !== 'undefined';
var symbolIteratorExists = symbolExists && typeof Symbol.iterator !== 'undefined';
var symbolToStringTagExists = symbolExists && typeof Symbol.toStringTag !== 'undefined';
var setEntriesExists = setExists && typeof Set.prototype.entries === 'function';
var mapEntriesExists = mapExists && typeof Map.prototype.entries === 'function';
var setIteratorPrototype = setEntriesExists && Object.getPrototypeOf(new Set().entries());
var mapIteratorPrototype = mapEntriesExists && Object.getPrototypeOf(new Map().entries());
var arrayIteratorExists = symbolIteratorExists && typeof Array.prototype[Symbol.iterator] === 'function';
var arrayIteratorPrototype = arrayIteratorExists && Object.getPrototypeOf([][Symbol.iterator]());
var stringIteratorExists = symbolIteratorExists && typeof String.prototype[Symbol.iterator] === 'function';
var stringIteratorPrototype = stringIteratorExists && Object.getPrototypeOf(''[Symbol.iterator]());
var toStringLeftSliceLength = 8;
var toStringRightSliceLength = -1;
/**
 * ### typeOf (obj)
 *
 * Uses `Object.prototype.toString` to determine the type of an object,
 * normalising behaviour across engine versions & well optimised.
 *
 * @param {Mixed} object
 * @return {String} object type
 * @api public
 */
function typeDetect(obj) {
  /* ! Speed optimisation
   * Pre:
   *   string literal     x 3,039,035 ops/sec ±1.62% (78 runs sampled)
   *   boolean literal    x 1,424,138 ops/sec ±4.54% (75 runs sampled)
   *   number literal     x 1,653,153 ops/sec ±1.91% (82 runs sampled)
   *   undefined          x 9,978,660 ops/sec ±1.92% (75 runs sampled)
   *   function           x 2,556,769 ops/sec ±1.73% (77 runs sampled)
   * Post:
   *   string literal     x 38,564,796 ops/sec ±1.15% (79 runs sampled)
   *   boolean literal    x 31,148,940 ops/sec ±1.10% (79 runs sampled)
   *   number literal     x 32,679,330 ops/sec ±1.90% (78 runs sampled)
   *   undefined          x 32,363,368 ops/sec ±1.07% (82 runs sampled)
   *   function           x 31,296,870 ops/sec ±0.96% (83 runs sampled)
   */
  var typeofObj = typeof obj;
  if (typeofObj !== 'object') {
    return typeofObj;
  }

  /* ! Speed optimisation
   * Pre:
   *   null               x 28,645,765 ops/sec ±1.17% (82 runs sampled)
   * Post:
   *   null               x 36,428,962 ops/sec ±1.37% (84 runs sampled)
   */
  if (obj === null) {
    return 'null';
  }

  /* ! Spec Conformance
   * Test: `Object.prototype.toString.call(window)``
   *  - Node === "[object global]"
   *  - Chrome === "[object global]"
   *  - Firefox === "[object Window]"
   *  - PhantomJS === "[object Window]"
   *  - Safari === "[object Window]"
   *  - IE 11 === "[object Window]"
   *  - IE Edge === "[object Window]"
   * Test: `Object.prototype.toString.call(this)``
   *  - Chrome Worker === "[object global]"
   *  - Firefox Worker === "[object DedicatedWorkerGlobalScope]"
   *  - Safari Worker === "[object DedicatedWorkerGlobalScope]"
   *  - IE 11 Worker === "[object WorkerGlobalScope]"
   *  - IE Edge Worker === "[object WorkerGlobalScope]"
   */
  if (obj === globalObject) {
    return 'global';
  }

  /* ! Speed optimisation
   * Pre:
   *   array literal      x 2,888,352 ops/sec ±0.67% (82 runs sampled)
   * Post:
   *   array literal      x 22,479,650 ops/sec ±0.96% (81 runs sampled)
   */
  if (
    Array.isArray(obj) &&
    (symbolToStringTagExists === false || !(Symbol.toStringTag in obj))
  ) {
    return 'Array';
  }

  // Not caching existence of `window` and related properties due to potential
  // for `window` to be unset before tests in quasi-browser environments.
  if (typeof window === 'object' && window !== null) {
    /* ! Spec Conformance
     * (https://html.spec.whatwg.org/multipage/browsers.html#location)
     * WhatWG HTML$7.7.3 - The `Location` interface
     * Test: `Object.prototype.toString.call(window.location)``
     *  - IE <=11 === "[object Object]"
     *  - IE Edge <=13 === "[object Object]"
     */
    if (typeof window.location === 'object' && obj === window.location) {
      return 'Location';
    }

    /* ! Spec Conformance
     * (https://html.spec.whatwg.org/#document)
     * WhatWG HTML$3.1.1 - The `Document` object
     * Note: Most browsers currently adher to the W3C DOM Level 2 spec
     *       (https://www.w3.org/TR/DOM-Level-2-HTML/html.html#ID-26809268)
     *       which suggests that browsers should use HTMLTableCellElement for
     *       both TD and TH elements. WhatWG separates these.
     *       WhatWG HTML states:
     *         > For historical reasons, Window objects must also have a
     *         > writable, configurable, non-enumerable property named
     *         > HTMLDocument whose value is the Document interface object.
     * Test: `Object.prototype.toString.call(document)``
     *  - Chrome === "[object HTMLDocument]"
     *  - Firefox === "[object HTMLDocument]"
     *  - Safari === "[object HTMLDocument]"
     *  - IE <=10 === "[object Document]"
     *  - IE 11 === "[object HTMLDocument]"
     *  - IE Edge <=13 === "[object HTMLDocument]"
     */
    if (typeof window.document === 'object' && obj === window.document) {
      return 'Document';
    }

    if (typeof window.navigator === 'object') {
      /* ! Spec Conformance
       * (https://html.spec.whatwg.org/multipage/webappapis.html#mimetypearray)
       * WhatWG HTML$8.6.1.5 - Plugins - Interface MimeTypeArray
       * Test: `Object.prototype.toString.call(navigator.mimeTypes)``
       *  - IE <=10 === "[object MSMimeTypesCollection]"
       */
      if (typeof window.navigator.mimeTypes === 'object' &&
          obj === window.navigator.mimeTypes) {
        return 'MimeTypeArray';
      }

      /* ! Spec Conformance
       * (https://html.spec.whatwg.org/multipage/webappapis.html#pluginarray)
       * WhatWG HTML$8.6.1.5 - Plugins - Interface PluginArray
       * Test: `Object.prototype.toString.call(navigator.plugins)``
       *  - IE <=10 === "[object MSPluginsCollection]"
       */
      if (typeof window.navigator.plugins === 'object' &&
          obj === window.navigator.plugins) {
        return 'PluginArray';
      }
    }

    if ((typeof window.HTMLElement === 'function' ||
        typeof window.HTMLElement === 'object') &&
        obj instanceof window.HTMLElement) {
      /* ! Spec Conformance
      * (https://html.spec.whatwg.org/multipage/webappapis.html#pluginarray)
      * WhatWG HTML$4.4.4 - The `blockquote` element - Interface `HTMLQuoteElement`
      * Test: `Object.prototype.toString.call(document.createElement('blockquote'))``
      *  - IE <=10 === "[object HTMLBlockElement]"
      */
      if (obj.tagName === 'BLOCKQUOTE') {
        return 'HTMLQuoteElement';
      }

      /* ! Spec Conformance
       * (https://html.spec.whatwg.org/#htmltabledatacellelement)
       * WhatWG HTML$4.9.9 - The `td` element - Interface `HTMLTableDataCellElement`
       * Note: Most browsers currently adher to the W3C DOM Level 2 spec
       *       (https://www.w3.org/TR/DOM-Level-2-HTML/html.html#ID-82915075)
       *       which suggests that browsers should use HTMLTableCellElement for
       *       both TD and TH elements. WhatWG separates these.
       * Test: Object.prototype.toString.call(document.createElement('td'))
       *  - Chrome === "[object HTMLTableCellElement]"
       *  - Firefox === "[object HTMLTableCellElement]"
       *  - Safari === "[object HTMLTableCellElement]"
       */
      if (obj.tagName === 'TD') {
        return 'HTMLTableDataCellElement';
      }

      /* ! Spec Conformance
       * (https://html.spec.whatwg.org/#htmltableheadercellelement)
       * WhatWG HTML$4.9.9 - The `td` element - Interface `HTMLTableHeaderCellElement`
       * Note: Most browsers currently adher to the W3C DOM Level 2 spec
       *       (https://www.w3.org/TR/DOM-Level-2-HTML/html.html#ID-82915075)
       *       which suggests that browsers should use HTMLTableCellElement for
       *       both TD and TH elements. WhatWG separates these.
       * Test: Object.prototype.toString.call(document.createElement('th'))
       *  - Chrome === "[object HTMLTableCellElement]"
       *  - Firefox === "[object HTMLTableCellElement]"
       *  - Safari === "[object HTMLTableCellElement]"
       */
      if (obj.tagName === 'TH') {
        return 'HTMLTableHeaderCellElement';
      }
    }
  }

  /* ! Speed optimisation
  * Pre:
  *   Float64Array       x 625,644 ops/sec ±1.58% (80 runs sampled)
  *   Float32Array       x 1,279,852 ops/sec ±2.91% (77 runs sampled)
  *   Uint32Array        x 1,178,185 ops/sec ±1.95% (83 runs sampled)
  *   Uint16Array        x 1,008,380 ops/sec ±2.25% (80 runs sampled)
  *   Uint8Array         x 1,128,040 ops/sec ±2.11% (81 runs sampled)
  *   Int32Array         x 1,170,119 ops/sec ±2.88% (80 runs sampled)
  *   Int16Array         x 1,176,348 ops/sec ±5.79% (86 runs sampled)
  *   Int8Array          x 1,058,707 ops/sec ±4.94% (77 runs sampled)
  *   Uint8ClampedArray  x 1,110,633 ops/sec ±4.20% (80 runs sampled)
  * Post:
  *   Float64Array       x 7,105,671 ops/sec ±13.47% (64 runs sampled)
  *   Float32Array       x 5,887,912 ops/sec ±1.46% (82 runs sampled)
  *   Uint32Array        x 6,491,661 ops/sec ±1.76% (79 runs sampled)
  *   Uint16Array        x 6,559,795 ops/sec ±1.67% (82 runs sampled)
  *   Uint8Array         x 6,463,966 ops/sec ±1.43% (85 runs sampled)
  *   Int32Array         x 5,641,841 ops/sec ±3.49% (81 runs sampled)
  *   Int16Array         x 6,583,511 ops/sec ±1.98% (80 runs sampled)
  *   Int8Array          x 6,606,078 ops/sec ±1.74% (81 runs sampled)
  *   Uint8ClampedArray  x 6,602,224 ops/sec ±1.77% (83 runs sampled)
  */
  var stringTag = (symbolToStringTagExists && obj[Symbol.toStringTag]);
  if (typeof stringTag === 'string') {
    return stringTag;
  }

  var objPrototype = Object.getPrototypeOf(obj);
  /* ! Speed optimisation
  * Pre:
  *   regex literal      x 1,772,385 ops/sec ±1.85% (77 runs sampled)
  *   regex constructor  x 2,143,634 ops/sec ±2.46% (78 runs sampled)
  * Post:
  *   regex literal      x 3,928,009 ops/sec ±0.65% (78 runs sampled)
  *   regex constructor  x 3,931,108 ops/sec ±0.58% (84 runs sampled)
  */
  if (objPrototype === RegExp.prototype) {
    return 'RegExp';
  }

  /* ! Speed optimisation
  * Pre:
  *   date               x 2,130,074 ops/sec ±4.42% (68 runs sampled)
  * Post:
  *   date               x 3,953,779 ops/sec ±1.35% (77 runs sampled)
  */
  if (objPrototype === Date.prototype) {
    return 'Date';
  }

  /* ! Spec Conformance
   * (http://www.ecma-international.org/ecma-262/6.0/index.html#sec-promise.prototype-@@tostringtag)
   * ES6$25.4.5.4 - Promise.prototype[@@toStringTag] should be "Promise":
   * Test: `Object.prototype.toString.call(Promise.resolve())``
   *  - Chrome <=47 === "[object Object]"
   *  - Edge <=20 === "[object Object]"
   *  - Firefox 29-Latest === "[object Promise]"
   *  - Safari 7.1-Latest === "[object Promise]"
   */
  if (promiseExists && objPrototype === Promise.prototype) {
    return 'Promise';
  }

  /* ! Speed optimisation
  * Pre:
  *   set                x 2,222,186 ops/sec ±1.31% (82 runs sampled)
  * Post:
  *   set                x 4,545,879 ops/sec ±1.13% (83 runs sampled)
  */
  if (setExists && objPrototype === Set.prototype) {
    return 'Set';
  }

  /* ! Speed optimisation
  * Pre:
  *   map                x 2,396,842 ops/sec ±1.59% (81 runs sampled)
  * Post:
  *   map                x 4,183,945 ops/sec ±6.59% (82 runs sampled)
  */
  if (mapExists && objPrototype === Map.prototype) {
    return 'Map';
  }

  /* ! Speed optimisation
  * Pre:
  *   weakset            x 1,323,220 ops/sec ±2.17% (76 runs sampled)
  * Post:
  *   weakset            x 4,237,510 ops/sec ±2.01% (77 runs sampled)
  */
  if (weakSetExists && objPrototype === WeakSet.prototype) {
    return 'WeakSet';
  }

  /* ! Speed optimisation
  * Pre:
  *   weakmap            x 1,500,260 ops/sec ±2.02% (78 runs sampled)
  * Post:
  *   weakmap            x 3,881,384 ops/sec ±1.45% (82 runs sampled)
  */
  if (weakMapExists && objPrototype === WeakMap.prototype) {
    return 'WeakMap';
  }

  /* ! Spec Conformance
   * (http://www.ecma-international.org/ecma-262/6.0/index.html#sec-dataview.prototype-@@tostringtag)
   * ES6$24.2.4.21 - DataView.prototype[@@toStringTag] should be "DataView":
   * Test: `Object.prototype.toString.call(new DataView(new ArrayBuffer(1)))``
   *  - Edge <=13 === "[object Object]"
   */
  if (dataViewExists && objPrototype === DataView.prototype) {
    return 'DataView';
  }

  /* ! Spec Conformance
   * (http://www.ecma-international.org/ecma-262/6.0/index.html#sec-%mapiteratorprototype%-@@tostringtag)
   * ES6$23.1.5.2.2 - %MapIteratorPrototype%[@@toStringTag] should be "Map Iterator":
   * Test: `Object.prototype.toString.call(new Map().entries())``
   *  - Edge <=13 === "[object Object]"
   */
  if (mapExists && objPrototype === mapIteratorPrototype) {
    return 'Map Iterator';
  }

  /* ! Spec Conformance
   * (http://www.ecma-international.org/ecma-262/6.0/index.html#sec-%setiteratorprototype%-@@tostringtag)
   * ES6$23.2.5.2.2 - %SetIteratorPrototype%[@@toStringTag] should be "Set Iterator":
   * Test: `Object.prototype.toString.call(new Set().entries())``
   *  - Edge <=13 === "[object Object]"
   */
  if (setExists && objPrototype === setIteratorPrototype) {
    return 'Set Iterator';
  }

  /* ! Spec Conformance
   * (http://www.ecma-international.org/ecma-262/6.0/index.html#sec-%arrayiteratorprototype%-@@tostringtag)
   * ES6$22.1.5.2.2 - %ArrayIteratorPrototype%[@@toStringTag] should be "Array Iterator":
   * Test: `Object.prototype.toString.call([][Symbol.iterator]())``
   *  - Edge <=13 === "[object Object]"
   */
  if (arrayIteratorExists && objPrototype === arrayIteratorPrototype) {
    return 'Array Iterator';
  }

  /* ! Spec Conformance
   * (http://www.ecma-international.org/ecma-262/6.0/index.html#sec-%stringiteratorprototype%-@@tostringtag)
   * ES6$21.1.5.2.2 - %StringIteratorPrototype%[@@toStringTag] should be "String Iterator":
   * Test: `Object.prototype.toString.call(''[Symbol.iterator]())``
   *  - Edge <=13 === "[object Object]"
   */
  if (stringIteratorExists && objPrototype === stringIteratorPrototype) {
    return 'String Iterator';
  }

  /* ! Speed optimisation
  * Pre:
  *   object from null   x 2,424,320 ops/sec ±1.67% (76 runs sampled)
  * Post:
  *   object from null   x 5,838,000 ops/sec ±0.99% (84 runs sampled)
  */
  if (objPrototype === null) {
    return 'Object';
  }

  return Object
    .prototype
    .toString
    .call(obj)
    .slice(toStringLeftSliceLength, toStringRightSliceLength);
}

return typeDetect;

})));

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(4)))

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// modified from https://github.com/es-shims/es5-shim
var has = Object.prototype.hasOwnProperty;
var toStr = Object.prototype.toString;
var slice = Array.prototype.slice;
var isArgs = __webpack_require__(5);
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
	$applicationCache: true,
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
			Object.keys = function keys(object) { // eslint-disable-line func-name-matching
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


/***/ }),
/* 4 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1, eval)("this");
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


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


/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: external "angular"
var external_angular_ = __webpack_require__(0);
var external_angular_default = /*#__PURE__*/__webpack_require__.n(external_angular_);

// EXTERNAL MODULE: ./node_modules/type-detect/type-detect.js
var type_detect = __webpack_require__(2);

// CONCATENATED MODULE: ./node_modules/deepcopy/src/buffer.mjs
const isBufferExists = typeof Buffer !== 'undefined';
const isBufferFromExists = isBufferExists && typeof Buffer.from !== 'undefined';

const isBuffer = isBufferExists
  ? /**
     * is value is Buffer?
     *
     * @param {*} value
     * @return {boolean}
     */
    function isBuffer(value) {
      return Buffer.isBuffer(value);
    }
  : /**
     * return false
     *
     * NOTE: for Buffer unsupported
     *
     * @return {boolean}
     */
    function isBuffer() {
      return false;
    };

const buffer_copy = isBufferFromExists
  ? /**
     * copy Buffer
     *
     * @param {Buffer} value
     * @return {Buffer}
     */
    function copy(value) {
      return Buffer.from(value);
    }
  : isBufferExists
    ? /**
       * copy Buffer
       *
       * NOTE: for old node.js
       *
       * @param {Buffer} value
       * @return {Buffer}
       */
      function copy(value) {
        return new Buffer(value);
      }
    : /**
       * shallow copy
       *
       * NOTE: for Buffer unsupported
       *
       * @param {*}
       * @return {*}
       */
      function copy(value) {
        return value;
      };

// CONCATENATED MODULE: ./node_modules/deepcopy/src/detector.mjs




/**
 * detect type of value
 *
 * @param {*} value
 * @return {string}
 */
function detectType(value) {
  // NOTE: isBuffer must execute before type-detect,
  // because type-detect returns 'Uint8Array'.
  if (isBuffer(value)) {
    return 'Buffer';
  }

  return type_detect(value);
}

// CONCATENATED MODULE: ./node_modules/deepcopy/src/collection.mjs


/**
 * collection types
 */
const collectionTypeSet = new Set([
  'Arguments',
  'Array',
  'Map',
  'Object',
  'Set'
]);

/**
 * get value from collection
 *
 * @param {Array|Object|Map|Set} collection
 * @param {string|number|symbol} key
 * @param {string} [type=null]
 * @return {*}
 */
function get(collection, key, type = null) {
  const valueType = type || detectType(collection);

  switch (valueType) {
    case 'Arguments':
    case 'Array':
    case 'Object':
      return collection[key];
    case 'Map':
      return collection.get(key);
    case 'Set':
      // NOTE: Set.prototype.keys is alias of Set.prototype.values
      // it means key is equals value
      return key;
    default:
  }
}

/**
 * check to type string is collection
 *
 * @param {string} type
 */
function isCollection(type) {
  return collectionTypeSet.has(type);
}

/**
 * set value to collection
 *
 * @param {Array|Object|Map|Set} collection
 * @param {string|number|symbol} key
 * @param {*} value
 * @param {string} [type=null]
 * @return {Array|Object|Map|Set}
 */
function set(collection, key, value, type = null) {
  const valueType = type || detectType(collection);

  switch (valueType) {
    case 'Arguments':
    case 'Array':
    case 'Object':
      collection[key] = value;
      break;
    case 'Map':
      collection.set(key, value);
      break;
    case 'Set':
      collection.add(value);
      break;
    default:
  }

  return collection;
}

// CONCATENATED MODULE: ./node_modules/deepcopy/src/copy_map.mjs


const globalObject = Function('return this')();

/**
 * copy ArrayBuffer
 *
 * @param {ArrayBuffer} value
 * @return {ArrayBuffer}
 */
function copyArrayBuffer(value) {
  return value.slice(0);
}

/**
 * copy Boolean
 *
 * @param {Boolean} value
 * @return {Boolean}
 */
function copyBoolean(value) {
  return new Boolean(value.valueOf());
}

/**
 * copy DataView
 *
 * @param {DataView} value
 * @return {DataView}
 */
function copyDataView(value) {
  // TODO: copy ArrayBuffer?
  return new DataView(value.buffer);
}

/**
 * copy Buffer
 *
 * @param {Buffer} value
 * @return {Buffer}
 */
function copyBuffer(value) {
  return buffer_copy(value);
}

/**
 * copy Date
 *
 * @param {Date} value
 * @return {Date}
 */
function copyDate(value) {
  return new Date(value.getTime());
}

/**
 * copy Number
 *
 * @param {Number} value
 * @return {Number}
 */
function copyNumber(value) {
  return new Number(value);
}

/**
 * copy RegExp
 *
 * @param {RegExp} value
 * @return {RegExp}
 */
function copyRegExp(value) {
  return new RegExp(value.source || '(?:)', value.flags);
}

/**
 * copy String
 *
 * @param {String} value
 * @return {String}
 */
function copyString(value) {
  return new String(value);
}

/**
 * copy TypedArray
 *
 * @param {*} value
 * @return {*}
 */
function copyTypedArray(value, type) {
  return globalObject[type].from(value);
}

/**
 * shallow copy
 *
 * @param {*} value
 * @return {*}
 */
function shallowCopy(value) {
  return value;
}

/**
 * get empty Array
 *
 * @return {Array}
 */
function getEmptyArray() {
  return [];
}

/**
 * get empty Map
 *
 * @return {Map}
 */
function getEmptyMap() {
  return new Map();
}

/**
 * get empty Object
 *
 * @return {Object}
 */
function getEmptyObject() {
  return {};
}

/**
 * get empty Set
 *
 * @return {Set}
 */
function getEmptySet() {
  return new Set();
}

/* harmony default export */ var copy_map = (new Map([
  // deep copy
  ['ArrayBuffer', copyArrayBuffer],
  ['Boolean', copyBoolean],
  ['Buffer', copyBuffer],
  ['DataView', copyDataView],
  ['Date', copyDate],
  ['Number', copyNumber],
  ['RegExp', copyRegExp],
  ['String', copyString],

  // typed arrays
  // TODO: pass bound function
  ['Float32Array', copyTypedArray],
  ['Float64Array', copyTypedArray],
  ['Int16Array', copyTypedArray],
  ['Int32Array', copyTypedArray],
  ['Int8Array', copyTypedArray],
  ['Uint16Array', copyTypedArray],
  ['Uint32Array', copyTypedArray],
  ['Uint8Array', copyTypedArray],
  ['Uint8ClampedArray', copyTypedArray],

  // shallow copy
  ['Array Iterator', shallowCopy],
  ['Map Iterator', shallowCopy],
  ['Promise', shallowCopy],
  ['Set Iterator', shallowCopy],
  ['String Iterator', shallowCopy],
  ['function', shallowCopy],
  ['global', shallowCopy],
  // NOTE: WeakMap and WeakSet cannot get entries
  ['WeakMap', shallowCopy],
  ['WeakSet', shallowCopy],

  // primitives
  ['boolean', shallowCopy],
  ['null', shallowCopy],
  ['number', shallowCopy],
  ['string', shallowCopy],
  ['symbol', shallowCopy],
  ['undefined', shallowCopy],

  // collections
  // NOTE: return empty value, because recursively copy later.
  ['Arguments', getEmptyArray],
  ['Array', getEmptyArray],
  ['Map', getEmptyMap],
  ['Object', getEmptyObject],
  ['Set', getEmptySet]

  // NOTE: type-detect returns following types
  // 'Location'
  // 'Document'
  // 'MimeTypeArray'
  // 'PluginArray'
  // 'HTMLQuoteElement'
  // 'HTMLTableDataCellElement'
  // 'HTMLTableHeaderCellElement'

  // TODO: is type-detect never return 'object'?
  // 'object'
]));

// CONCATENATED MODULE: ./node_modules/deepcopy/src/copier.mjs



/**
 * no operation
 */
function noop() {}

/**
 * copy value
 *
 * @param {*} value
 * @param {string} [type=null]
 * @param {Function} [customizer=noop]
 * @return {*}
 */
function copier_copy(value, type = null, customizer = noop) {
  if (arguments.length === 2 && typeof type === 'function') {
    customizer = type;
    type = null;
  }

  const valueType = type || detectType(value);
  const copyFunction = copy_map.get(valueType);

  if (valueType === 'Object') {
    const result = customizer(value, valueType);

    if (result !== undefined) {
      return result;
    }
  }

  // NOTE: TypedArray needs pass type to argument
  return copyFunction ? copyFunction(value, valueType) : value;
}

// CONCATENATED MODULE: ./node_modules/deepcopy/src/index.mjs




/**
 * deepcopy function
 *
 * @param {*} value
 * @param {Object|Function} [options]
 * @return {*}
 */
function deepcopy(value, options = {}) {
  if (typeof options === 'function') {
    options = {
      customizer: options
    };
  }

  const {
    // TODO: before/after customizer
    customizer
    // TODO: max depth
    // depth = Infinity,
  } = options;

  const valueType = detectType(value);

  if (!isCollection(valueType)) {
    return recursiveCopy(value, null, null, null, customizer);
  }

  const copiedValue = copier_copy(value, valueType, customizer);

  const references = new WeakMap([[value, copiedValue]]);
  const visited = new WeakSet([value]);

  return recursiveCopy(value, copiedValue, references, visited, customizer);
}

/**
 * recursively copy
 *
 * @param {*} value target value
 * @param {*} clone clone of value
 * @param {WeakMap} references visited references of clone
 * @param {WeakSet} visited visited references of value
 * @param {Function} customizer user customize function
 * @return {*}
 */
function recursiveCopy(value, clone, references, visited, customizer) {
  const type = detectType(value);
  const copiedValue = copier_copy(value, type);

  // return if not a collection value
  if (!isCollection(type)) {
    return copiedValue;
  }

  let keys;

  switch (type) {
    case 'Arguments':
    case 'Array':
      keys = Object.keys(value);
      break;
    case 'Object':
      keys = Object.keys(value);
      keys.push(...Object.getOwnPropertySymbols(value));
      break;
    case 'Map':
    case 'Set':
      keys = value.keys();
      break;
    default:
  }

  // walk within collection with iterator
  for (let collectionKey of keys) {
    const collectionValue = get(value, collectionKey, type);

    if (visited.has(collectionValue)) {
      // for [Circular]
      set(clone, collectionKey, references.get(collectionValue), type);
    } else {
      const collectionValueType = detectType(collectionValue);
      const copiedCollectionValue = copier_copy(collectionValue, collectionValueType);

      // save reference if value is collection
      if (isCollection(collectionValueType)) {
        references.set(collectionValue, copiedCollectionValue);
        visited.add(collectionValue);
      }

      set(
        clone,
        collectionKey,
        recursiveCopy(
          collectionValue,
          copiedCollectionValue,
          references,
          visited,
          customizer
        ),
        type
      );
    }
  }

  // TODO: isSealed/isFrozen/isExtensible

  return clone;
}

// CONCATENATED MODULE: ./node_modules/deepcopy/index.mjs


// CONCATENATED MODULE: ./src/service.js



/* harmony default export */ var src_service = (service_httpEtagProvider);

function service_httpEtagProvider () {
  var httpEtagProvider = this

  var serviceAdapterMethods = [
    'createCache',
    'getCache'
  ]

  var cacheAdapterMethods = [
    'setItem',
    'getItem',
    'removeItem',
    'removeAllItems'
    // info method hard-coded
  ]

  var requiredAdapterMethods = serviceAdapterMethods.concat(cacheAdapterMethods)

  // Built-in adapters defined in ./cacheServiceAdapters.js
  var cacheAdapters = {}
  var cacheDefinitions = {}

  // Cache config defaults
  var defaultCacheId = 'httpEtagCache'
  var defaultEtagCacheConfig = {
    deepCopy: false,
    cacheResponseData: true,
    cacheService: '$cacheFactory',
    cacheOptions: {
      number: 25
    }
  }

  /**
   * SERVICE PROVIDER
   * .setDefaultCacheConfig(config)
   * .defineCache(cacheId, config)
   * .defineCacheServiceAdapter(serviceName, config)
   * .getCacheServiceAdapter(serviceName)
   */

  httpEtagProvider.setDefaultCacheConfig = function httpEtagSetDefaultCacheOptions (config) {
    defaultEtagCacheConfig = external_angular_default.a.extend({}, defaultEtagCacheConfig, config)
    return httpEtagProvider
  }

  httpEtagProvider.getDefaultCacheConfig = function httpEtagGetDefaultCacheOptions () {
    return defaultEtagCacheConfig
  }

  httpEtagProvider.defineCache = function httpEtagDefineCache (cacheId, config) {
    config = external_angular_default.a.extend({}, defaultEtagCacheConfig, config, { id: cacheId })
    cacheDefinitions[cacheId] = config
    return httpEtagProvider
  }

  httpEtagProvider.defineCacheServiceAdapter = function httpEtagDefineCacheServiceAdapter (serviceName, config) {
    if (!config) throw new Error('Missing cache service adapter configuration')
    if (!config.methods) throw new Error('Missing cache service adapter configuration methods')
    external_angular_default.a.forEach(requiredAdapterMethods, function (method) {
      if (typeof config.methods[method] !== 'function') {
        throw new Error('Expected cache service adapter method "' + method + '" to be a function')
      }
    })

    cacheAdapters[serviceName] = config
    return httpEtagProvider
  }

  httpEtagProvider.getCacheServiceAdapter = function httpEtagGetCacheServiceAdapter (serviceName) {
    return cacheAdapters[serviceName]
  }

  /**
   * SERVICE
   * .info()
   * .getCache(acheId)
   * .getItemCache(cacheId, itemKey)
   */

  httpEtagProvider.$get = ['$injector', function httpEtagFactory ($injector) {
    var httpEtagService = {}

    var services = {}
    var adaptedServices = {}
    var caches = {}
    var adaptedCaches = {}

    // Add default cache if not already defined
    if (!cacheDefinitions[defaultCacheId]) httpEtagProvider.defineCache(defaultCacheId)

    // Find/inject cache service and create adapted versions
    external_angular_default.a.forEach(cacheAdapters, function adaptCacheService (adapter, serviceName) {
      var service = services[serviceName] = window[serviceName] || $injector.get(serviceName)
      var adaptedService = adaptedServices[serviceName] = {}

      external_angular_default.a.forEach(serviceAdapterMethods, function (method) {
        adaptedService[method] = external_angular_default.a.bind({}, adapter.methods[method], service)
      })
    })

    // Instantiate caches and create adapted versions
    external_angular_default.a.forEach(cacheDefinitions, function adaptCache (config, cacheId) {
      adaptedServices[config.cacheService].createCache(cacheId, config)
      var cache = caches[cacheId] = adaptedServices[config.cacheService].getCache(cacheId)
      var adaptedCache = adaptedCaches[cacheId] = {}
      // Determine whether to perform deepcopying or not
      var serviceDeepCopies = cacheAdapters[config.cacheService].config.storesDeepCopies
      var deepCopy = !serviceDeepCopies && cacheDefinitions[cacheId].deepCopy
      var copy = function (value) {
        return deepCopy ? deepcopy(value) : value
      }

      external_angular_default.a.forEach(cacheAdapterMethods, function (method) {
        var adapterMethod = cacheAdapters[config.cacheService].methods[method]
        var wrappedMethod
        var wrappedRawMethod

        // Wrap set/get methods to set/get to the `responseData` property of an
        // object. This is where the $http interceptor stores response data.
        if (method === 'getItem') {
          wrappedMethod = function getCacheItemResponseData (cache, itemKey, options) {
            var cachedData = adapterMethod(cache, itemKey, options)
            return cachedData && copy(cachedData.responseData)
          }

          wrappedRawMethod = function getCacheItemData (cache, itemKey, options) {
            return copy(adapterMethod(cache, itemKey, options))
          }
        }

        if (method === 'setItem') {
          wrappedMethod = function setCacheItemResponseData (cache, itemKey, value, options) {
            var cachedData = adaptedCache.$getItem(itemKey)
            value = copy(value)

            if (cachedData && typeof cachedData === 'object') {
              cachedData.responseData = value
              value = cachedData
            } else value = { responseData: value }

            adapterMethod(cache, itemKey, value, options)
          }

          wrappedRawMethod = function setCacheItemData (cache, itemKey, value, options) {
            adapterMethod(cache, itemKey, copy(value), options)
          }
        }

        adaptedCache[method] = external_angular_default.a.bind({}, (wrappedMethod || adapterMethod), cache)
        if (wrappedRawMethod) {
          adaptedCache['$' + method] = external_angular_default.a.bind({}, wrappedRawMethod, cache)
        }
      })

      adaptedCache.unsetItem = function adaptedCacheUnsetItemCache (itemKey) {
        adaptedCache.setItem(itemKey, undefined)
      }
      adaptedCache.expireItem = function adaptedCacheUnsetItemCache (itemKey) {
        var data = adaptedCache.$getItem(itemKey)
        delete data.etagHeader
        adaptedCache.$setItem(itemKey, data)
      }
      adaptedCache.getItemCache = function adaptedCacheGetItemCache (itemKey) {
        return httpEtagService.getItemCache(cacheId, itemKey)
      }
      adaptedCache.info = function adaptedCacheInfo () {
        return cacheDefinitions[cacheId]
      }
      adaptedCache.isCache = true
    })

    httpEtagService.info = function httpEtagServiceInfo () {
      return cacheDefinitions
    }

    httpEtagService.getCache = function httpEtagServiceGetCache (cacheId) {
      var cache = adaptedCaches[processCacheId(cacheId)]
      if (cache) return cache
    }

    httpEtagService.getItemCache = function httpEtagServiceGeItemCache (cacheId, itemKey) {
      var cache = httpEtagService.getCache(cacheId)
      var itemCache = {}
      if (!cache) return

      var methodMappings = [
        ['set', 'setItem'],
        ['get', 'getItem'],
        ['$set', '$setItem'],
        ['$get', '$getItem'],
        ['unset', 'unsetItem'],
        ['expire', 'expireItem'],
        ['remove', 'removeItem']
      ]

      external_angular_default.a.forEach(methodMappings, function mapCacheMethdodsToItemCache (methods) {
        itemCache[methods[0]] = external_angular_default.a.bind({}, cache[methods[1]], itemKey)
      })

      itemCache.info = function itemCacheInfo () {
        var itemCacheInfo = cache.info()
        itemCacheInfo.itemKey = itemKey
        return itemCacheInfo
      }

      itemCache.isItemCache = true

      return itemCache
    }

    httpEtagService.purgeCaches = function httpEtagPurgeCaches () {
      external_angular_default.a.forEach(adaptedCaches, function (cache) {
        cache.removeAllItems()
      })
    }

    function processCacheId (cacheId) {
      var type = typeof cacheId
      var isDefined = type === 'number' || (type === 'string' && !!cacheId)
      return isDefined ? cacheId : defaultCacheId
    }

    return httpEtagService
  }]
}

// EXTERNAL MODULE: ./node_modules/object-keys/index.js
var object_keys = __webpack_require__(3);
var object_keys_default = /*#__PURE__*/__webpack_require__.n(object_keys);

// EXTERNAL MODULE: ./node_modules/array-map/index.js
var array_map = __webpack_require__(1);
var array_map_default = /*#__PURE__*/__webpack_require__.n(array_map);

// CONCATENATED MODULE: ./src/httpDecorator.js




/* harmony default export */ var httpDecorator = (httpEtagHttpDecorator);

httpEtagHttpDecorator.$inject = ['$delegate', 'httpEtag']

function httpEtagHttpDecorator ($delegate, httpEtag) {
  var $http = $delegate
  var cachableHttpMethods = [
    'GET',
    'JSONP'
  ]

  function $httpDecorator (httpConfig) {
    var useLegacyPromiseExtensions = httpEtagHttpDecorator.useLegacyPromiseExtensions()
    var hasConfig = !!httpConfig.etagCache
    var isCacheableMethod = cachableHttpMethods.indexOf(httpConfig.method) >= 0
    var isCachable = hasConfig && isCacheableMethod
    var httpPromise

    if (isCachable) {
      var etagCacheConfig = processHttpConfigEtagValue(httpConfig)
      if (etagCacheConfig) {
        var itemCache = httpEtag.getItemCache(etagCacheConfig.id, etagCacheConfig.itemKey)
        if (!itemCache) throw new Error('No defined ETag caches match specified cache ID')

        var cacheInfo = itemCache.info()
        var rawCacheData = itemCache.$get()
        var cachedEtag = rawCacheData && rawCacheData.etagHeader
        var cachedResponse = cachedEtag && rawCacheData.responseData

        // Allow easy access to cache in interceptor
        httpConfig.$$_itemCache = itemCache

        if (cachedEtag) {
          httpConfig.headers = external_angular_default.a.extend({}, httpConfig.headers, {
            'If-None-Match': cachedEtag
          })
        }
      }
    }

    httpPromise = $http.apply($http, arguments)
    httpEtagPromiseFactory(httpPromise)

    function httpEtagPromiseFactory (httpPromise) {
      var then = httpPromise.then
      var success = httpPromise.success

      if (useLegacyPromiseExtensions) {
        httpPromise.cached = function httpEtagPromiseCached (callback) {
          if (rawCacheData && cacheInfo.cacheResponseData) {
            callback(cachedResponse, 'cached', undefined, httpConfig, itemCache)
          }
          return httpPromise
        }
      } else {
        httpPromise.cached = function deprecatedEtagPromiseCached () {
          throw new Error('The method `cached` on the promise returned from `$http` has been disabled in favor of `ifCached`.')
        }
      }

      httpPromise.ifCached = function httpEtagPromiseIfCached (callback) {
        if (rawCacheData && cacheInfo.cacheResponseData) {
          // We're simply mimicking the Angular API here, so... sorry, Standard.
          // eslint-disable-next-line standard/no-callback-literal
          callback({
            data: cachedResponse,
            status: 'cached',
            headers: undefined,
            config: httpConfig
          }, itemCache)
        }
        return httpPromise
      }

      httpPromise.then = function httpEtagThenWrapper (successCallback, errorCallback, progressBackCallback) {
        var thenPromise = then.apply(httpPromise, [
          successCallback ? httpEtagSuccessWrapper : undefined,
          errorCallback ? httpEtagErrorWrapper : undefined,
          progressBackCallback
        ])

        function httpEtagSuccessWrapper (response) {
          return successCallback(response, itemCache)
        }

        function httpEtagErrorWrapper (response) {
          return errorCallback(response, itemCache)
        }

        return httpEtagPromiseFactory(thenPromise)
      }

      if (useLegacyPromiseExtensions && itemCache) {
        httpPromise.success = function httpEtagPromiseSuccess (callback) {
          var partializedCallback = partial(callback, undefined, undefined, undefined, undefined, itemCache)
          return success.apply(httpPromise, [partializedCallback])
        }
      }

      return httpPromise
    }

    return httpPromise
  }

  // Decorate the cachable shortcut methods, too
  external_angular_default.a.forEach(cachableHttpMethods, function (httpMethod) {
    var method = httpMethod.toLowerCase()
    $httpDecorator[method] = function httpEtagHttpShortcutWrapper (url, config) {
      config = external_angular_default.a.extend({}, config, {
        method: httpMethod,
        url: url
      })

      return $httpDecorator.call($http, config)
    }
  })

  // Copy over all other properties and methods
  external_angular_default.a.forEach($http, function copyHttpPropertyToDectorator (value, key) {
    if (!$httpDecorator[key]) $httpDecorator[key] = value
  })

  /**
   * HELPERS
   */

  function processHttpConfigEtagValue (httpConfig) {
    var etagValue = httpConfig.etagCache
    var etagValueType = typeof etagValue
    var etagCacheConfig = {}

    // Evaluate function first
    if (etagValueType === 'function') {
      etagValue = etagValue(httpConfig)
      etagValueType = typeof etagValue
    }

    // Plain, cache, or itemCache objects
    if (etagValueType === 'object') {
      var id, itemKey

      if (etagValue.isCache) {
        id = etagValue.info().id
        itemKey = generateCacheItemKey(httpConfig)
      } else if (etagValue.isItemCache) {
        id = etagValue.info().id
        itemKey = etagValue.info().itemKey
      } else {
        id = etagValue.id
        itemKey = etagValue.itemKey || generateCacheItemKey(httpConfig)
      }

      etagCacheConfig.id = id
      etagCacheConfig.itemKey = itemKey
    } else if (etagValueType === 'string') {
      etagCacheConfig.id = etagValue
      etagCacheConfig.itemKey = generateCacheItemKey(httpConfig)
    } else if (etagValue === true) {
      // Undefined cacheId will use the default cacheId as defined in provider
      etagCacheConfig.itemKey = generateCacheItemKey(httpConfig)
    } else return
    return etagCacheConfig
  }

  function generateCacheItemKey (httpConfig) {
    var url = httpConfig.url
    var params = stringifyParams(httpConfig.params)
    var joiner = ((params && url.indexOf('?') > 0) ? '&' : '?')
    var queryString = (params && joiner + params) || ''
    return url + queryString
  }

  // Based on npm package "query-string"
  function stringifyParams (obj) {
    return obj ? array_map_default()(object_keys_default()(obj).sort(), function (key) {
      var val = obj[key]

      if (external_angular_default.a.isArray(val)) {
        return array_map_default()(val.sort(), function (val2) {
          return encodeURIComponent(key) + '=' + encodeURIComponent(val2)
        }).join('&')
      }

      return encodeURIComponent(key) + '=' + encodeURIComponent(val)
    }).join('&') : ''
  }

  // http://ejohn.org/blog/partial-functions-in-javascript/
  function partial (fn) {
    var args = Array.prototype.slice.call(arguments, 1)
    return function () {
      var arg = 0
      for (var i = 0; i < args.length && arg < arguments.length; i++) {
        if (args[i] === undefined) args[i] = arguments[arg++]
      }
      return fn.apply(this, args)
    }
  }

  return $httpDecorator
}

// CONCATENATED MODULE: ./src/httpInterceptor.js
/* harmony default export */ var httpInterceptor = (httpEtagInterceptorFactory);

function httpEtagInterceptorFactory () {
  function responseInterceptor (response) {
    var itemCache = response.config.$$_itemCache

    if (itemCache) {
      var cacheInfo = itemCache.info()
      var cacheResponseData = cacheInfo.cacheResponseData
      var etag = response.headers().etag
      var cacheData = {}

      if (etag) {
        cacheData.etagHeader = etag
        if (cacheResponseData) cacheData.responseData = response.data
        itemCache.$set(cacheData)
      }

      delete response.config.$$_itemCache
    }

    return response
  }

  return {
    response: responseInterceptor
  }
}

// CONCATENATED MODULE: ./src/cacheServiceAdapters.js


/* harmony default export */ var cacheServiceAdapters = (cacheAdaptersConfig);

cacheAdaptersConfig.$inject = ['httpEtagProvider']

function cacheAdaptersConfig (httpEtagProvider) {
  httpEtagProvider

    .defineCacheServiceAdapter('$cacheFactory', {
      config: {
        storesDeepCopies: false
      },
      methods: {
        createCache: function createCache ($cacheFactory, cacheId, options) {
          $cacheFactory(cacheId, options)
        },
        getCache: function getCache ($cacheFactory, cacheId) {
          return $cacheFactory.get(cacheId)
        },
        setItem: function setItem (cache, itemKey, value) {
          cache.put(itemKey, value)
        },
        getItem: function getItem (cache, itemKey) {
          return cache.get(itemKey)
        },
        removeItem: function removeItem (cache, itemKey) {
          cache.remove(itemKey)
        },
        removeAllItems: function removeAllItems (cache, itemKey) {
          cache.removeAll()
        }
      }
    })

    .defineCacheServiceAdapter('localStorage', {
      config: {
        storesDeepCopies: true
      },
      methods: {
        createCache: external_angular_default.a.noop,
        getCache: function getCache (localStorage, cacheId) {
          return cacheId
        },
        setItem: function setItem (cacheId, itemKey, value) {
          try {
            itemKey = cacheId + ':' + itemKey
            localStorage.setItem(itemKey, JSON.stringify(value))
          } catch (e) {

          }
        },
        getItem: function getItem (cacheId, itemKey) {
          itemKey = cacheId + ':' + itemKey
          return JSON.parse(localStorage.getItem(itemKey))
        },
        removeItem: function removeItem (cacheId, itemKey) {
          itemKey = cacheId + ':' + itemKey
          localStorage.removeItem(itemKey)
        },
        removeAllItems: function removeAllItems (cacheId, itemKey) {
          var keyPrefix = cacheId + ':'

          external_angular_default.a.forEach(localStorage, function (value, key) {
            if (key.indexOf(keyPrefix) === 0) {
              localStorage.removeItem(key)
            }
          })
        }
      }
    })

    .defineCacheServiceAdapter('sessionStorage', {
      config: {
        storesDeepCopies: true
      },
      methods: {
        createCache: external_angular_default.a.noop,
        getCache: function getCache (sessionStorage, cacheId) {
          return cacheId
        },
        setItem: function setItem (cacheId, itemKey, value) {
          try {
            itemKey = cacheId + ':' + itemKey
            sessionStorage.setItem(itemKey, JSON.stringify(value))
          } catch (e) {

          }
        },
        getItem: function getItem (cacheId, itemKey) {
          itemKey = cacheId + ':' + itemKey
          return JSON.parse(sessionStorage.getItem(itemKey))
        },
        removeItem: function removeItem (cacheId, itemKey) {
          itemKey = cacheId + ':' + itemKey
          sessionStorage.removeItem(itemKey)
        },
        removeAllItems: function removeAllItems (cacheId, itemKey) {
          var keyPrefix = cacheId + ':'

          external_angular_default.a.forEach(sessionStorage, function (value, key) {
            if (key.indexOf(keyPrefix) === 0) {
              sessionStorage.removeItem(key)
            }
          })
        }
      }
    })
}

// CONCATENATED MODULE: ./src/index.js






/* harmony default export */ var src = __webpack_exports__["default"] = (external_angular_default.a
  .module('http-etag', [])
  .provider('httpEtag', src_service)
  .config(cacheServiceAdapters)
  .config(['$provide', '$httpProvider', function addHttpEtagInterceptor ($provide, $httpProvider) {
    httpDecorator.useLegacyPromiseExtensions =
      $httpProvider.useLegacyPromiseExtensions ||
      function useLegacyPromiseExtensions () {
        return external_angular_default.a.version.major === 1 && external_angular_default.a.version.minor < 6
      }
    $provide.decorator('$http', httpDecorator)
    $httpProvider.interceptors.push(httpInterceptor)
  }])
  .name);


/***/ })
/******/ ]);
});