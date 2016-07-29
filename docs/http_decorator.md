# $http Decorator

Allows `angular-http-etag` to cache request ETags and response data.

**Usage Example:**

``` javascript
$http
  .get('/data', {
    etagCache: true
  })
  .success(function (data, status, headers, config, itemCache) {
    data._fullName = data.first_name + ' ' data.last_name
    itemCache.set(data)
    self.fullName = data._fullName
  })
  .cached(function (data, status, headers, config, itemCache) {
    self.fullName = data._fullName
  })
  .error(function (data, status) {
    if (status != 304) alert('Request error')
  })
```

## $http Config

The `etagCache` `$http` config property accepts the following value types:

| Type | Details |
| :-- | :-- |
| `boolean` | If `true`, use default `cacheId` and `itemKey`. |
| `string` | String representing the `cacheId` to be used. |
| `object.<string>` | Object with `cacheId` property and optional `itemKey` property. See below. |
| `function` | A function that returns one of the above value types. The current `$http` config is passed an argument. |

Config object with optional `itemKey` property. If not specified, one will be generated based on the request URL/params.

``` javascript
{
  cacheId: 'sessionCache',
  itemKey: 'specifiedKey' // Optional property
}
```

As a contrived example, if you wanted to store request data for users in cache items
keyed to their ID, you might use a function like so:

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
