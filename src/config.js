'use strict';

module.exports = httpEtagModuleConfig;

httpEtagModuleConfig.$inject = ['$httpProvider'];

function httpEtagModuleConfig ($httpProvider) {
  $httpProvider.interceptors.push('httpEtagInterceptor');
}
