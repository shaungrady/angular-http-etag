# Service Provider

Define caches with specific configurations and define adapters for 3rd-party
cache services.

Example usage:

``` javascript
angular
  .module('myModule', ['angular-http-etag'])
  .config(function(httpEtagProvider) {

    httpEtagProvider
      .setDefaultCacheConfig({
        // Default cacheService is `$cacheFactory`
        cacheOptions: { number: 10 }          
      })
      .defineCache('lruCache', {
        deepCopy: true
      })
      // sessionStorage and localStorage don't support any cacheOptions,
      // so they're not LRU caches.
      .defineCache('sessionCache', {
        cacheService: 'sessionStorage'
      })
      .defineCache('localCache', {
        cacheService: 'localStorage'
      })

  })
```

---

**Methods**

-   [`defineCache(id[, config])`](#defineCache)
-   [`setDefaultCacheConfig(config)`](#setDefaultCacheConfig)
-   `getDefaultCacheOptions()`
-   `defineCacheServiceAdapter(name, config)`
-   `getCacheServiceAdapter()`

---

## defineCache

``` javascript
httpEtagProvider
  .defineCache('cacheWithDefaultConfig')
  .defineCache('cacheWithConfig', {
    cacheService: 'sessionStorage'
  })
```

Define a new cache with an ID and an optional configuration. Returns provider.
If no configuration is specified, the default configuration is used. The default
can be set using [`setDefaultCacheConfig()`](#setDefaultCacheConfig).

| Param | Type | Details |
| -- | -- | -- |
| `id` | `string` | A unique string representing the ID of the cache. |
| `config` | `object` | Object describing the configuration of the cache. See section below for details |

### Config Object

Default configuration:

``` javascript
{
  cacheService: '$cacheFactory',
  cacheOptions: {
    number: 25
  },
  deepCopy: false,
  cacheResponseData: true
}
```

| Property | Type | Details |
| -- | -- |
| `cacheService` | `string` | Name of cache service this cache will use. |
| `cacheOptions` | `object` | Options passed to the cache service when instantiating this cache. |
| `deepCopy` | `boolean` | Create a deep copy of the data when setting and getting cache data. |
| `cacheResponseData` | `boolean` | Whether or not the response data should be cached. ETag header will be cached regardless. |

## setDefaultCacheConfig
