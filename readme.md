# Angular HTTP ETag

[![npm version](https://badge.fury.io/js/angular-http-etag.svg)](http://badge.fury.io/js/angular-http-etag)
[![Build Status](https://travis-ci.org/shaungrady/angular-http-etag.svg?branch=master)](https://travis-ci.org/shaungrady/angular-http-etag)
[![Test Coverage](https://codeclimate.com/github/shaungrady/angular-http-etag/badges/coverage.svg)](https://codeclimate.com/github/shaungrady/angular-http-etag/coverage)
[![Code Climate](https://codeclimate.com/github/shaungrady/angular-http-etag/badges/gpa.svg)](https://codeclimate.com/github/shaungrady/angular-http-etag)  
[![dependencies Status](https://david-dm.org/shaungrady/angular-http-etag/status.svg)](https://david-dm.org/shaungrady/angular-http-etag)
[![peerDependencies Status](https://david-dm.org/shaungrady/angular-http-etag/peer-status.svg)](https://david-dm.org/shaungrady/angular-http-etag?type=peer)
[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

Tested: IE 9+; Edge 13; Chrome 29, 50+; Firefox 46+; Safari 7+; iOS 9.2+; Android 4.4, 5.1.

---

Easy ETag-based caching for `$http` service requests! Increase responsiveness, decrease bandwidth usage.

* Caches ETag headers and sends them back to the server in the `If-None-Match` header.
* Caches response data with flexible cache configuration.
* Support for `$cacheFactory`, `sessionStorage`, and `localStorage` caches out-of-the-box.
* Easily [adaptable][Cache Service Adapters] for other third-party cache services.
* Compatible with Angular 1.2–1.6.

**Example Usage:**

``` javascript
angular
  .module('myApp', [
    'http-etag'
  ])
  .config(function (httpEtagProvider) {
    httpEtagProvider
      .defineCache('persistentCache', {
        cacheService: 'localStorage'
      })
  })

  .controller('MyCtrl', function ($http) {
    var self = this

    $http
      .get('/my_data.json', {
        etagCache: 'persistentCache'
      })
      .then(function success (response, itemCache) {
        var data = response.data
        // Modify the data from the server
        data._fullName = data.first_name + ' ' + data.last_name
        // Update the cache with the modified data
        itemCache.set(data)
        // Assign to controller property
        self.fullName = data._fullName
      }, function error (response) {
        if (response.status != 304) alert('Request error')
      })
      // Synchronous method called if request was previously cached
      // status == 'cached'; headers === undefined;
      .ifCached(function (response, itemCache) {
        self.fullName = data._fullName
      })
  })
```

_Need more information on how ETags work? [Read this](http://bitworking.org/news/ETags__This_stuff_matters)._

## Detailed Documentation

- [Service Provider]
- [Service]
- [$http Decorator]
- [Cache Service Adapters]

[Service Provider]: https://github.com/shaungrady/angular-http-etag/blob/master/docs/service_provider.md
[Service]: https://github.com/shaungrady/angular-http-etag/blob/master/docs/service.md
[$http Decorator]: https://github.com/shaungrady/angular-http-etag/blob/master/docs/http_decorator.md
[Cache Service Adapters]: https://github.com/shaungrady/angular-http-etag/blob/master/docs/cache_service_adapters.md

## Quick Guide

### Install Module

``` bash
$ npm install angular-http-etag
```

Or download from [master/release](https://github.com/shaungrady/angular-http-etag/tree/master/release)

### Include Dependency

Include `'http-etag'` in your module's dependencies.

``` javascript
// The node module exports the string 'http-etag'...
angular.module('myApp', [
  require('angular-http-etag')
])
```

``` javascript
// ... otherwise, include the code first then the module name
angular.module('myApp', [
  'http-etag'
])
```

### Define Caches

``` javascript
.config(function ('httpEtagProvider') {
  httpEtagProvider
    .defineCache('persistentCache', {
      cacheService: 'localStorage'
    })
    .defineCache('sessionCache', {
      cacheService: 'sessionStorage'
    })
    .defineCache('memoryCache', {
      cacheService: '$cacheFactory',
      cacheOptions: {
        number: 50 // LRU cache
      },
      deepCopy: true // $cacheFactory copies by reference by default
    })
})
```

If you so desire, you can define your own caches. The default cache uses `$cacheFactory`
and is limited to 25 cache items (Least Recently Used algorithm).

Define the caches you'd like to use by using `defineCache(cacheId[, config])`, passing a cache ID
followed by the cache configuration. The configuration you pass will extend the
default configuration, which can be set using the `setDefaultCacheConfig(config)`
method. If you don't pass a config, a new cache will be defined using the default config.

 _See more in the [Service Provider] documentation._

### Cache Requests

Using the default cache with default configuration and an automatically generated cache itemKey based on the request:

``` javascript
$http.get('/data', {
    etagCache: true
  })
  .then(responseHandler)
  .ifCached(responseHandler)

function responseHandler (response, itemCache) {
  // Differentiating between cached and successful request responses
  var isCached = response.status === 'cached'

  // itemCache is a cache object bound to the cache item associated with this request.
  itemCache.info()
  // { id: 'httpEtagCache',
  //   itemKey: '/data',
  //   deepCopy: false,
  //   cacheResponseData: true,
  //   cacheService: '$cacheFactory',
  //   cacheOptions: { number: 25 } }
}
```

Using a defined cache from the previous section and an automatically generated cache itemKey:

``` javascript
$http.get('/data', {
    etagCache: 'persistentCache'
  })
  .then(responseHandler)
  .ifCached(responseHandler)

function responseHandler (response, itemCache) {
  itemCache.info()
  // { id: 'persistentCache',
  //   itemKey: '/data',
  //   deepCopy: false,
  //   cacheResponseData: true,
  //   cacheService: 'localStorage',
  //   cacheOptions: { number: 25 } }
}
```
Using a defined cache and a specified key for the cache item:

``` javascript
$http.get('/data', {
    etagCache: {
      id: 'persistentCache',
      itemKey: 'whatFineKeyYouHave'
    }
  })
  .then(responseHandler)
  .ifCached(responseHandler)

function responseHandler (response, itemCache) {
  itemCache.info()
  // { id: 'persistentCache',
  //   itemKey: 'whatFineKeyYouHave',
  //   deepCopy: false,
  //   cacheResponseData: true,
  //   cacheService: 'localStorage',
  //   cacheOptions: { number: 25 } }
}
```

The `etagCache` property also accepts a function that returns on of the values
demonstrated; a `boolean`, a `string`, or an `object`.

 _See more in the [$http Decorator] and [Service] documentation._

## Contributing

Write an issue. Then, possibly, hopefully...

1. Fork the repo.
2. Make a branch.
3. Write the code.
3. Write the tests.
3. Run tests. (`npm test`)
3. Open a pull request.
