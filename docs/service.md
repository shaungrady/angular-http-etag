# Service

Manipulate defined caches through the service.

## httpEtag Service

**Example Usage:**

``` javascript
.controller('MyCtrl', function (httpEtag) {
  // Get the default cache
  var cache = httpEtag.getCache()
  cache.info()
  // { deepCopy: false,
  //   cacheResponseData: true,
  //   cacheService: '$cacheFactory',
  //   cacheOptions: { number: 25 },
  //   id: 'httpEtagCache' }

  cache.setItem('myItemKey', [{ hello: 'world' }])
  cache.getItem('myItemKey') //> [{ hello: 'world' }]

  // Get itemKey-bound itemCache object
  var itemCache = cache.getItemCache('myItemKey') // or httpEtag.getItemCache('httpEtagCache', 'myItemKey')
  itemCache.info()
  // { deepCopy: false,
  //   cacheResponseData: true,
  //   cacheService: '$cacheFactory',
  //   cacheOptions: { number: 25 },
  //   id: 'httpEtagCache',
  //   itemKey: 'myItemKey' }

  itemCache.get() //> [{ hello: 'world' }]
  itemCache.unset()

  cache.getItem('myItemKey') //> undefined
})
```
### Service Methods

| Method | Details |
| :-- | :-- |
| `info()` | Returns an object with information about the cache configuration. |
| `getCache([cacheId])` | Returns a `cache` object matching the specified `cacheId`. If no `cacheId` is specified, the default cache is returned. |
| `getItemCache(cacheId, itemKey)` | Returns an `itemCache`—a `cache` object that's bound to the specified item. |

There are two kinds of cache objects. A `cache` and an `itemCache`. A `cache` object can interact with all items or a specific item within that cache. An `itemCache` only interacts with a specific item in a cache. They share many of the same methods, but with a small difference in naming. They are detailed below.

## cache Object

On `setItem` and `getItem` options: Some cache services may allow for additional options to be passed when setting or getting cache data; `$cacheFactory`, `localStorage`, and `sessionStorage` do not, but a third-party cache service defined using a [Cache Service Adapter](cache_service_adapter.md) may.

| Method | Details |
| :-- | :-- |
| `setItem(itemKey, value[, options])` | Insert a value into the cache under the specified `itemKey`. |
| `getItem(itemKey[, options])` | Retrieve data from the cache under the specified `itemKey`. |
| `unsetItem(itemKey)` | Unset data in the cache under the specified `itemKey`.<br>**Note:** This will not remove a cached ETag header associated with this cache item. |
| `expireItem(itemKey)` | Unset a cached ETag associated with this cache item.<br>**Note:** This will not remove data stored in the cache under the specified `itemKey` |
| `removeItem(itemKey)` | Remove the cached data and ETag associated with the specified `itemKey`. |
| `removeAllItems()` | Remove cached data and ETags from all items stored in the cache. |
| `getItemCache(itemKey)` | Retrieve an `itemCache` object bound to the specified `itemKey`. |


## itemCache Object



| Method | Details |
| :-- | :-- |
| `set(value[, options])` | Insert a value into the cache item. |
| `get([options])` | Retrieve data from the cache item. |
| `unset()` | Unset data in the cache item.<br>**Note:** This will not remove a cached ETag header associated with this cache item. |
| `expire()` | Unset a cached ETag associated with this cache item.<br>**Note:** This will not remove data stored in this cache item. |
| `remove()` | Remove the cached data and ETag associated with the cache item. |