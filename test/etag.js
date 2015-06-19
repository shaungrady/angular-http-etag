'use strict';

/*global describe, beforeEach, it*/

var chai  = require('chai');
var spies = require('chai-spies');
chai.use(spies);
var should = chai.should();
var spy    = chai.spy;

var angular = require('angular');
require('angular-mocks/ngMock');


describe('angular-http-etag', function () {
  beforeEach(angular.mock.module(require('../')));

  var $http, $httpBackend, interceptor, ifEtagIs, ifEtagIsNot, onSuccess, onError;

  beforeEach(angular.mock.inject(function ($injector) {
    $http        = $injector.get('$http');
    $httpBackend = $injector.get('$httpBackend');
    interceptor  = $injector.get('httpEtagInterceptor');

    ifEtagIs     = function (etag) {
      return function (headers) { return headers['If-None-Match'] === etag; };
    };

    ifEtagIsNot  = function (etag) {
      return function (headers) { return headers['If-None-Match'] !== etag; };
    };

    onSuccess    = spy(angular.noop);
    onError      = spy(angular.noop);

    $httpBackend
      .whenGET('/1.json', ifEtagIsNot('1'))
      .respond('', { 'etag': '1' });
    $httpBackend
      .whenGET('/1.json', ifEtagIs('1'))
      .respond(304);

    $httpBackend
      .whenGET('/1.json?param=test', ifEtagIsNot('1'))
      .respond('', { 'etag': '1' });
    $httpBackend
      .whenGET('/1.json?param=test', ifEtagIs('1'))
      .respond(304);

  }));


  it('should cache ETags', function () {
    $http.get('/1.json', { etag: true })
      .success(onSuccess);
    $httpBackend.flush();

    $http.get('/1.json', { etag: true })
      .error(onError);
    $httpBackend.flush();

    onSuccess.should.have.been.called();
    onError.should.have.been.called();
  });


  it('should cache ETags for requests with query params', function () {
    $http.get('/1.json', { etag: true, params: { param: 'test' } })
      .success(onSuccess);
    $httpBackend.flush();

    $http.get('/1.json', { etag: true, params: { param: 'test' } })
      .error(onError);
    $httpBackend.flush();

    onSuccess.should.have.been.called();
    onError.should.have.been.called();
  });


  it('should allow for passing of an ETag string', function () {
    $http.get('/1.json', { etag: '1' })
      .error(onError);
    $httpBackend.flush();

    $http.get('/1.json', { etag: '2' })
      .success(onSuccess);
    $httpBackend.flush();

    onSuccess.should.have.been.called();
    onError.should.have.been.called();
  });


});
