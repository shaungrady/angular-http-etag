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
        getCache: function () {
          return localStorage
        },
        setItem: function (localStorage, itemKey, value) {
          localStorage.setItem(itemKey, JSON.stringify(value))
        },
        getItem: function (localStorage, itemKey) {
          return JSON.parse(localStorage.getItem(itemKey))
        },
        removeItem: function (localStorage, itemKey) {
          localStorage.removeItem(itemKey)
        },
        removeAllItems: function (localStorage, itemKey) {
          angular.forEach(localStorage, function (value, key) {
            localStorage.removeItem(key)
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
        getCache: function () {
          return sessionStorage
        },
        setItem: function (sessionStorage, itemKey, value) {
          sessionStorage.setItem(itemKey, JSON.stringify(value))
        },
        getItem: function (sessionStorage, itemKey) {
          return JSON.parse(sessionStorage.getItem(itemKey))
        },
        removeItem: function (sessionStorage, itemKey) {
          sessionStorage.removeItem(itemKey)
        },
        removeAllItems: function (sessionStorage, itemKey) {
          angular.forEach(sessionStorage, function (value, key) {
            sessionStorage.removeItem(key)
          })
        }
      }
    })
}
