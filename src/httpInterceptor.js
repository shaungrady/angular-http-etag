'use strict'

// var angular = require('angular')
module.exports = httpEtagInterceptorFactory

function httpEtagInterceptorFactory () {
  function responseInterceptor (response) {
    var itemCache = response.config.$$_itemCache
    var etag = response.headers().etag

    if (itemCache) {
      // Don't assume server sent etag header
      if (etag) {
        itemCache.set({
          responseData: response.data,
          etagHeader: etag
        })
      }
      delete response.config.$$_itemCache
    }

    return response
  }

  return { response: responseInterceptor }
}
