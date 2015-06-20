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

  var $http, $httpBackend, $cacheFactory, userCache,
      interceptor, ifEtagIs, ifEtagIsNot, onSuccess, onError;

  beforeEach(angular.mock.inject(function ($injector) {
    $http         = $injector.get('$http');
    $httpBackend  = $injector.get('$httpBackend');
    $cacheFactory = $injector.get('$cacheFactory');
    interceptor   = $injector.get('httpEtagInterceptor');

    onSuccess = spy(angular.noop);
    onError   = spy(angular.noop);

    ifEtagIs = function (etag) {
      return function (headers) { return headers['If-None-Match'] === etag; };
    };

    ifEtagIsNot = function (etag) {
      return function (headers) { return headers['If-None-Match'] !== etag; };
    };

    userCache = $cacheFactory('test');

    $httpBackend
      .whenGET('/1.json', ifEtagIsNot('1'))
      .respond({ id:1, content:'Test data' }, { 'etag': '1' });
    $httpBackend
      .whenGET('/1.json', ifEtagIs('1'))
      .respond(304);

    $httpBackend
      .whenGET('/1.json?param=test', ifEtagIsNot('1'))
      .respond({ id:1, content:'Test data' }, { 'etag': '1' });
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


  it('should function without ETag config property', function () {
    $http.get('/1.json').success(onSuccess);
    $httpBackend.flush();

    $http.get('/1.json').error(onError);
    $httpBackend.flush();

    onSuccess.should.have.been.called();
    onError.should.not.have.been.called();
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


  it('should allow for usage of a user\'s own $cacheFactory cache', function () {
    $http.get('/1.json', {
        etag: { cache: { id:'test', key:1 } }
      })
      .success(onSuccess);
    $httpBackend.flush();

    userCache.get(1).$$etag.should.equal('1');

    $http.get('/1.json', {
        etag: { cache: { id:'test', key:1 } }
      })
      .error(onError);
    $httpBackend.flush();

    onSuccess.should.have.been.called();
    onError.should.have.been.called();
  });


  it('should ignore an invalid $cacheFactory ID', function () {
    $http.get('/1.json', {
        etag: { cache: { id:'invalid', key:1 } }
      })
      .success(onSuccess);
    $httpBackend.flush();

    $http.get('/1.json', {
        etag: { cache: { id:'invalid', key:1 } }
      })
      .success(onSuccess);
    $httpBackend.flush();

    onSuccess.should.have.been.called.twice;
  });


});
