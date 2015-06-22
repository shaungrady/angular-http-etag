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

  var $http, $httpBackend, $cacheFactory, serverData,
      ifEtagIs, ifEtagIsNot, onCache, onSuccess, onError;

  beforeEach(angular.mock.inject(function ($injector) {
    $http         = $injector.get('$http');
    $httpBackend  = $injector.get('$httpBackend');
    $cacheFactory = $injector.get('$cacheFactory');

    onCache   = spy('$http().cache',   angular.noop);
    onSuccess = spy('$http().success', angular.noop);
    onError   = spy('$http().error',   angular.noop);

    ifEtagIs = function (etag) {
      return function (headers) { return headers['If-None-Match'] === etag; };
    };

    ifEtagIsNot = function (etag) {
      return function (headers) { return headers['If-None-Match'] !== etag; };
    };

    serverData = { id:1, content:'Test data' };

    $httpBackend
      .whenGET('/1.json', ifEtagIsNot('1'))
      .respond(serverData, { 'etag': '1' });
    $httpBackend
      .whenGET('/1.json', ifEtagIs('1'))
      .respond(304);

    $httpBackend
      .whenGET('/1.json?param=test', ifEtagIsNot('1'))
      .respond(serverData, { 'etag': '1' });
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


  it('should cache data', function () {
    var userData;

    $http.get('/1.json', { etag: true })
      .success(onSuccess);
    $httpBackend.flush();

    $http.get('/1.json', { etag: true })
      .cache(function (data) {
        userData = data;
      })
      .error(onError);
    $httpBackend.flush();

    userData.should.deep.equal(serverData);
    onError.should.have.been.called();
  });


  it('should function normally without ETag config property', function () {
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


});
