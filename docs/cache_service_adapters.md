# Cache Service Adapters

``` javascript
httpEtagProvider
  .defineCacheServiceAdapter(serviceName, config)
```

A cache service adapter allows `angular-http-etag` to make use of a third-party
cache service—either an Angular service or a global service. For usage examples,
the [built-in adapters can be viewed here](../src/cacheServiceAdapters.js).

Annotated `$cacheFactory` adapter:

``` javascript
httpEtagProvider
  // To find the service, the name is first looked for on the
  // `window` object. If not found, it will be injected via the
  // Angular `$injector` service.
  .defineCacheServiceAdapter('$cacheFactory', {

    // Configure how angular-http-etag interacts with the service.
    config: {

      // Currently, `storesDeepCopies` is the only property supported.
      // This tells angular-http-etag whether or not this services
      // stores cache objects as a copy-by-reference or copy-by-value.
      // For example, localStorage stores data as a string, so
      // storesDeepCopies is set to `true` for the localStorage service.
      storesDeepCopies: false
    },

    // These methods are what angular-http-etag uses to interact with
    // this cache service. Only the `get`-prefixed methods expect a
    // value to be returned. In the case of `localStorage`, there
    // is no concept of instantiating a cache, so  `createCache` is
    // an empty function, and `getCache` simply returns the `localStorage` object.
    methods: {
      createCache: function ($cacheFactory, cacheId, options) {
        $cacheFactory(cacheId, options)
      },
      getCache: function ($cacheFactory, cacheId) {
        return $cacheFactory.get(cacheId)
      },
      setItem: function (cache, itemKey, value) {
        cache.put(itemKey, value)
      },
      getItem: function (cache, itemKey) {
        return cache.get(itemKey)
      },
      removeItem: function (cache, itemKey) {
        cache.remove(itemKey)
      },
      removeAllItems: function (cache, itemKey) {
        cache.removeAll()
      }
    }
  })
```
