# Angular HTTP ETag Interceptor
Adds ETag support to the `$http` service.


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


## A Word About ETags and Response Caching

To start automatically caching response ETags and sending them in subsequent requests to the same URLs, simply add the `etag: true` property to your `$http config` object.

This module assumes you will manage response data caching yourself. Additionally, ETag caching is done in-memory only. For Single Page Apps, that's all you need.

 When an ETag is sent and the server responds with a `304 - Not Modified`, no data is sent back from the server and the `$http` service considers the response to be an error. Consider:

``` javascript

var userData;

function fetchData () {
  $http.get('/users/77.json', {
      etag: true
    })
    .success(function (data) {
      userData = data;
    })
    .error(function (data, status) {
      if (status == 304)
        console.log('Not modified.');
    });
}

// The first request would behave as any other. When the server returns a response,
// the `etag` header is automatically stored in memory within the service.
fetchData();

// The next time the request is made, the `If-None-Match` header is set to the
// ETag returned by the most recent request to that URL.
// In this call, if the data for user 77 hasn't changed on the server, the
// response will be an error with a status of 304.
fetchData();

```

## API
To make use of this module, simply add an `etag` property to your `$http` request config.


### Automatic ETag Caching/Sending
Response ETags are cached and automatically sent in the `If-None-Match` header on subsequent requests.
``` javascript
$http.get('/', {
  etag: true
});
```

### Specify an ETag
A shortcut to send a specific ETag to the server. Response ETag will be cached as before.
``` javascript
$http.get('/', {
  etag: '123789456'
});
```

### Use Your Own $cacheFactory Cache
If you'd like ETag and response data to be cached in your own $cacheFactory cache automatically. This is useful for sharing cached response data across controllers and in distinct caches.

``` javascript
// Our own LRU cache
var cache = $cacheFactory('myCache', {
  number: 10
});
var userData;

$http.get('/users/77.json', {
    etag: {
      // $cacheFactory id and key to store response data under
      cache: {
        id:  'myCache',
        key: 77
      }
    }
  })
  .success(function (data) {
    userData = data;
  })
  .error(function (data, status) {
    if (status === 304 && !userData) {
      userData = cache.get(77);
      // ETag data is also stored in the cached data on the `$$etag` property.
      console.log('Not modified. Used ETag', userData.$$etag);
    }
  })
```
