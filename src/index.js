import angular from 'angular'
import service from './service'
import httpDecorator from './httpDecorator'
import httpInterceptor from './httpInterceptor'
import cacheServiceAdapters from './cacheServiceAdapters'

var _$provide

export default angular
  .module('http-etag', [])
  .provider('httpEtag', service)
  .config(cacheServiceAdapters)
  .config(['$provide', '$httpProvider', function addHttpEtagInterceptor ($provide, $httpProvider) {
    _$provide = $provide
    $httpProvider.interceptors.push(httpInterceptor)

    httpDecorator.useLegacyPromiseExtensions =
      $httpProvider.useLegacyPromiseExtensions ||
      function useLegacyPromiseExtensions () { return true }
  }])
  .run(function decorateHttpService () {
    _$provide.decorator('$http', httpDecorator)
  })
  .name
