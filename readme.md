# Angular HTTP ETag Module

[![Build Status](https://travis-ci.org/shaungrady/angular-http-etag.svg?branch=master)](https://travis-ci.org/shaungrady/angular-http-etag)
[![Test Coverage](https://codeclimate.com/github/shaungrady/angular-http-etag/badges/coverage.svg)](https://codeclimate.com/github/shaungrady/angular-http-etag/coverage)
[![Code Climate](https://codeclimate.com/github/shaungrady/angular-http-etag/badges/gpa.svg)](https://codeclimate.com/github/shaungrady/angular-http-etag)
[![npm version](https://badge.fury.io/js/angular-http-etag.svg)](http://badge.fury.io/js/angular-http-etag)

Adds easy ETag-based caching to the `$http` service. It...

* Decorates the `$http` service to provide a synchronous `cache` method on the
returned promise.

* Intercepts `$http` responses to cache response data and ETags.

* Utilizes `$cacheFactory` for in-memory caching; ideal for single-page apps.

* All leveraged by adding a single property to your `$http` config objects: `etag: true`.


## Installation

`$ npm install angular-http-etag`


## Setup

Include `'http-etag'` in your module's dependencies.

``` javascript
// The node module exports the string 'http-etag'...
angular.module('myApp', [
  require('http-etag')
]);

// ... otherwise, include the code first then the module name
angular.module('myApp', [
  'http-etag'
]);
```

## Provider
#### `httpEtagProvider.cache(id, [options])`
Instantiates a `$cacheFactory` cache with the given ID and options.
The default cache is configured with `{ number: 25 }`. To override the default,
simply define a cache with the ID of `default` and your desired options. Returns self.

All cache IDs are prefixed with `etag-` to avoid collisions.

``` javascript
angular
  .module('MyApp', ['http-etag'])
  .config(['httpEtagProvider', function (httpEtagProvider) {

    httpEtagProvider
      .cache('lruCache', { number: 5 })
      .cache('infiniteCache');

  }]);
```

## API

To enable caching/transmission of ETags as well as caching of response data, simply
add the `etag` property to the configuration object passed to your `$http` calls.

The value can either be `true`, in which case the default `httpEtag` cache will
be used, or it can be the ID of a cache you've configured with `httpEtagProvider`.

For valid `$http` requests that have the `etag` property in their configuration,
a new method will be attached to the returned promise: `cache(function)`. It's
important to note that, unlike the other promise methods, `cache` is synchronous.
If the request has previously been cached, the function passed to `cache` will
be called with the previously cached data. If no cached data exists, the function
will not be called.

---

An example of basic usage utilizing the default cache (25-entry LRU `$cacheFactory` cache):

``` javascript
var userData;

$http.get('/users/77.json', {
    etag: true // Or 'lruCache', 'infiniteCache', etc.
  })

  // Synchronous method, calls fn with cached data if cached data exists
  .cache(function (data) {
    if (!userData)
      userData = data;
  })

  // Successful request, ETag is cached and sent in subsequent requests, response
  // data is cached and sent to functions passed to the {promise}.cache method
  .success(function (data) {
    userData = data;
  })

  // If status == 304, data wasn't modified, and it generally shouldn't
  // be treated as an error. Since data isn't sent from the server, the
  // {promise}.cache method above ensures you have the freshest data cached
  // from a previous request.
  .error(function (data, status) {
    if (status != 304)
      alert('Request error');
  });
```
