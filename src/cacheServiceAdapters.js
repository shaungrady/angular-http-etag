'use strict'

var angular = require('angular')

module.exports = cacheAdaptersConfig

cacheAdaptersConfig.$inject = ['httpEtagProvider']

function cacheAdaptersConfig (httpEtagProvider) {
  httpEtagProvider

    .defineCacheServiceAdapter('$cacheFactory', {
      config: {
        storesDeepCopies: false
      },
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

    .defineCacheServiceAdapter('localStorage', {
      config: {
        storesDeepCopies: true
      },
      methods: {
        createCache: angular.noop,
        getCache: function (localStorage, cacheId) {
          return cacheId
        },
        setItem: function (cacheId, itemKey, value) {
          itemKey = cacheId + ':' + itemKey
          localStorage.setItem(itemKey, JSON.stringify(value))
        },
        getItem: function (cacheId, itemKey) {
          itemKey = cacheId + ':' + itemKey
          return JSON.parse(localStorage.getItem(itemKey))
        },
        removeItem: function (cacheId, itemKey) {
          itemKey = cacheId + ':' + itemKey
          localStorage.removeItem(itemKey)
        },
        removeAllItems: function (cacheId, itemKey) {
          var keyPrefix = cacheId + ':'
          var keyPrefixLen = keyPrefix.length

          angular.forEach(localStorage, function (value, key) {
            if (key.substr(0, keyPrefixLen) === keyPrefix) {
              localStorage.removeItem(key)
            }
          })
        }
      }
    })

    .defineCacheServiceAdapter('sessionStorage', {
      config: {
        storesDeepCopies: true
      },
      methods: {
        createCache: angular.noop,
        getCache: function (sessionStorage, cacheId) {
          return cacheId
        },
        setItem: function (cacheId, itemKey, value) {
          itemKey = cacheId + ':' + itemKey
          sessionStorage.setItem(itemKey, JSON.stringify(value))
        },
        getItem: function (cacheId, itemKey) {
          itemKey = cacheId + ':' + itemKey
          return JSON.parse(sessionStorage.getItem(itemKey))
        },
        removeItem: function (cacheId, itemKey) {
          itemKey = cacheId + ':' + itemKey
          sessionStorage.removeItem(itemKey)
        },
        removeAllItems: function (cacheId, itemKey) {
          var keyPrefix = cacheId + ':'
          var keyPrefixLen = keyPrefix.length

          angular.forEach(sessionStorage, function (value, key) {
            if (key.substr(0, keyPrefixLen) === keyPrefix) {
              sessionStorage.removeItem(key)
            }
          })
        }
      }
    })
}
