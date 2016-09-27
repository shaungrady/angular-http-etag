import angular from 'angular'
import service from './service'
import httpDecorator from './httpDecorator'
import httpInterceptor from './httpInterceptor'
import cacheServiceAdapters from './cacheServiceAdapters'

export default angular
  .module('http-etag', [])
  .provider('httpEtag', service)
  .config(cacheServiceAdapters)
  .config(['$provide', '$httpProvider', function addHttpEtagInterceptor ($provide, $httpProvider) {
    httpDecorator.useLegacyPromiseExtensions =
      $httpProvider.useLegacyPromiseExtensions ||
      function useLegacyPromiseExtensions () { return true }
    $provide.decorator('$http', httpDecorator)
    $httpProvider.interceptors.push(httpInterceptor)
  }])
  .name
