# Service

Manipulate caches and cache items defined through the [Service Provider](service_provider.md).

## httpEtag Service

**Example Usage:**

``` javascript
.controller('MyCtrl', function (httpEtag) {
  // Get the default cache
  var cache = httpEtag.getCache()
  cache.info()
  // { id: 'httpEtagCache',
  //   deepCopy: false,
  //   cacheResponseData: true,
  //   cacheService: '$cacheFactory',
  //   cacheOptions: { number: 25 } }

  cache.setItem('myItemKey', [{ hello: 'world' }])
  cache.getItem('myItemKey') //> [{ hello: 'world' }]

  // Get itemKey-bound itemCache object
  var itemCache = cache.getItemCache('myItemKey') // or httpEtag.getItemCache('httpEtagCache', 'myItemKey')
  itemCache.info()
  // { id: 'httpEtagCache',
  //   itemKey: 'myItemKey',
  //   deepCopy: false,
  //   cacheResponseData: true,
  //   cacheService: '$cacheFactory',
  //   cacheOptions: { number: 25 } }

  itemCache.get() //> [{ hello: 'world' }]
  itemCache.unset()

  cache.getItem('myItemKey') //> undefined
})
```
### Service Methods

| Method | Details |
| :-- | :-- |
| `info()` | Returns an object with information about the cache configuration. |
| `getCache([cacheId])` | Returns a `cache` object matching the specified `cacheId`.<br>If no `cacheId` is specified, the default cache is returned. |
| `getItemCache(cacheId, itemKey)` | Returns an `itemCache`—a `cache` object that's bound to the specified item.<br>A shortcut for `httpEtag.getCache('id').getCacheItem('itemKey')`. |
| `purgeCaches()` | Remove all cache items from all defined caches. |

There are two kinds of cache objects. A `cache` and an `itemCache`. A `cache` object can interact with all items or a specific item within that cache. An `itemCache` only interacts with a specific item in a cache. They share many of the same methods, but with a small difference in naming. The `itemCache` is detailed below.

## cache Object

On `setItem` and `getItem` options: Some cache services may allow for additional options to be passed when setting or getting cache data; `$cacheFactory`, `localStorage`, and `sessionStorage` do not, but a third-party cache service defined using a [Cache Service Adapter](cache_service_adapters.md) may.

| Method | Details |
| :-- | :-- |
| `info()` | Returns an object with information about the cache configuration, including cache ID. |
| `setItem(itemKey, value[, options])` | Insert a value into the cache under the `itemKey`. |
| `getItem(itemKey[, options])` | Retrieve data from the cache under the `itemKey`. |
| `unsetItem(itemKey)` | Unset data in the cache under the `itemKey`.<br>This does not remove a cached ETag header associated with the cache item. |
| `expireItem(itemKey)` | Unset a cached ETag associated with this cache item.<br>This does not remove data stored in the cache item. |
| `removeItem(itemKey)` | Remove the cached data and ETag associated with the specified `itemKey`. |
| `removeAllItems()` | Remove cached data and ETags from all items stored in the cache. |
| `getItemCache(itemKey)` | Retrieve an `itemCache` object bound to the specified `itemKey`. |


## itemCache Object

When using an ETag cache with the `$http` service, an `itemCache` object is passed as the 5th argument to `success` and `cached` callbacks. [Read more about the $http Decorator here](http_decorator.md).

| Method | Details |
| :-- | :-- |
| `info()` | Returns an object with information about the cache configuration, including cache ID and cache item key. |
| `set(value[, options])` | Insert a value into the cache item. |
| `get([options])` | Retrieve data from the cache item. |
| `unset()` | Unset data in the cache item.<br>This does not remove a cached ETag header associated with the cache item. |
| `expire()` | Unset a cached ETag associated with this cache item.<br>This does not remove data stored in the cache item. |
| `remove()` | Remove the cached data and ETag associated with the cache item. |
