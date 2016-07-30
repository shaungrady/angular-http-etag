# Service Provider

Define caches with specific configurations and define adapters for 3rd-party
cache services.

**Example usage:**

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


| Method | Details |
| :-- | :-- |
| [`defineCache(id[, config])`](#definecache) | Define a cache with default or specified config (extends default). |
| [`setDefaultCacheConfig(config)`](#setdefaultcacheconfig) | Define the default cache config. |
| [`getDefaultCacheConfig()`](#getdefaultcacheconfig) | Get default config. |
| [`defineCacheServiceAdapter(name, config)`](#definecacheserviceadapter) | Define a [Cache Service Adapter](cache_service_adapters.md) for third-party cache support. |
| [`getCacheServiceAdapter(name)`](#getcacheserviceadapter) | Get named [Cache Service Adapter](cache_service_adapters.md) config. |

---

## defineCache

`httpEtagProvider.defineCache(id[, config])`

| Argument | Type | Details |
| -- | -- | -- |
| `id` | `string` | A unique string representing the ID of the cache. |
| `config` | `object` | Object describing the configuration of the cache. See section below for details |

Define a new cache with an ID and an optional configuration. Returns provider.
If a configuration is specified, it will extend the default config.
If no configuration is specified, the default configuration is used. The default
can be set using [`setDefaultCacheConfig()`](#setdefaultcacheconfig).

**Example usage:**

``` javascript
httpEtagProvider
  .defineCache('cacheWithDefaultConfig')
  .defineCache('cacheWithConfig', {
    // Extends the default config
    cacheService: 'sessionStorage'
  })
```

## setDefaultCacheConfig

`setDefaultCacheConfig(config)`

| Config Property | Type | Details |
| :-- | :-- | :-- |
| `cacheService` | `string` | Name of cache service the cache will use.<br>Built-in support for `$cacheFactory`, `localStorage`, and `sessionStorage`. |
| `cacheOptions` | `object` | Options passed to the cache service when instantiating the cache. |
| `deepCopy` | `boolean` | Create a deep copy of the data when setting and getting cache data. |
| `cacheResponseData` | `boolean` | Whether or not the response data should be cached. ETag header will be cached regardless.

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

## getDefaultCacheConfig

`getDefaultCacheConfig()`

Get the default configuration object.

## defineCacheServiceAdapter

`defineCacheServiceAdapter(serviceName, config)`

Use this method to define adapters for third-party cache services.
More information can be found in the [Cache Service Adapter](cache_service_adapters.md)
documentation.

## getCacheServiceAdapter

`defineCacheServiceAdapter(serviceName)`

Get the adapter configuration object for the specified service.

---

 _Continue by reading the [$http Decorator] and [Service] documentation._
