# $http Decorator

Allows `angular-http-etag` to cache request ETags and response data.

**Usage Example:**

``` javascript
var promise = $http
  .get('/data', {
    // Also accepts a string, object, or function as detailed below
    etagCache: true
  })

  .success(function (data, status, headers, config, itemCache) {
    // Modify the data from the server
    data._fullName = data.first_name + ' ' + data.last_name
    // Update the cache with the modified data
    itemCache.set(data)
    // Assign to controller property
    self.fullName = data._fullName
  })

  .cached(function (data, status, headers, config, itemCache) {
    // status === 'cached'
    // headers === undefined
    self.fullName = data._fullName
  })

  .error(function (data, status) {
    if (status != 304) alert('Request error')
  })

// Or, without using legacy promise extensions:
promise
  .then(function successHandler (response, itemCache) {
    var data = response.data
    data._fullName = data.first_name + ' ' + data.last_name
    itemCache.set(data)
    self.fullName = data._fullName
  })
  .cached(function (data, status, headers, config, itemCache) {
    self.fullName = data._fullName
  })
```

## cached Method

As you may have noticed, the promise returned by `$http` has a new `cached` method.
Instead of being asynchronous like `success` and `error` are, `cached` is synchronous.
If the request being made has previously cached data associated with it, `cached`
will be called immediately and the cached data response data will be returned
in the `data` argument. Since it's not a true server response, the `status` argument
is set to `'cached'` instead of an HTTP Status Code, and `headers` is `undefined`.
The `config` argument will return the `$http` config as normal.

Lastly, an `itemCache` is passed in as the 5th argument allowing for easily
manipulation of the cache item associated with the performed request.
[More details](#itemcache-object) can be found below.


## $http Config

The `etagCache` `$http` config property accepts the following value types:

| Type | Details |
| :-- | :-- |
| `boolean` | If `true`, use default `cacheId` and `itemKey`. Or `false` to disable caching. |
| `string` | String representing the `cacheId` to be used. Default used if string is empty. |
| `object.<string>` | Object with `cacheId` property and optional `itemKey` property. See below. |
| `cache` | A `cache` or `itemCache` object. If a `cache` object, the default `itemKey` will be used.  |
| `function` | A function that returns one of the above value types. The current `$http` config is passed an argument. |

Config object with optional `itemKey` property. If not specified, one will be generated based on the request URL/params.

``` javascript
{
  cacheId: 'sessionCache',
  itemKey: 'specifiedKey' // Optional property
}
```

Below is a contrived example demonstrating the use of a function to return a cache
configuration object.

``` javascript
function fetchUser (id) {
  $http
    .get('/users/331.json', {
      etagCache: getEtagCacheConfig
    })
    .cached(function (data, status, headers, config, itemCache) {
      status === 'cached'
      itemCache.info().id === 'persistentCache'
      itemCache.info().itemKey === '311'
      itemCache.get() === data
    })
}

function getEtagCacheConfig (httpConfig) {
  var match = httpConfig.url.match(/([^/]+)\.json$/)
  var key = match[1]
  return {
    id: 'persistentCache',
    itemKey: key
  }
}
```

#### itemCache Object

The `itemCache` object that is passed to `cached` and `success` callbacks has the
following methods. Note that, if using a third-party cache service, it may accept
an additional `options` argument for the `set` and `get` methods. The build-in
cache services do not, however.

| Method | Details |
| :-- | :-- |
| `info()` | Return info about this cacheItem |
| `set(value[, options])` | Update the cache with the passed value and optional options (if the cache service supports options) |
| `get([options])` | Get the cache contents with optional options (if the cache service supports options) |
| `unset()` | Remove cached data while preserving the cached ETag. |
| `expire()` | Remove cached ETag while preserving the cached data. |
| `remove()` | Clear the cached response data and ETag. |
