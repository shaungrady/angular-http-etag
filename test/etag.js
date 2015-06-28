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
  var $http, $httpBackend, $cacheFactory, httpEtag, testModule, serverData,
      ifEtagIs, ifEtagIsNot, onCache, onSuccess, onError;

  testModule = angular.module('test', ['http-etag']).config(['httpEtagProvider', function (httpEtagProvider) {
    httpEtagProvider
      .cache('test')
      .cache('keyParserTest', {
        keyParser: function (url, params) {
          var match = url.match(/\/(\d+).json/i);
          return (match || [])[1];
        }
      });
  }]);

  beforeEach(angular.mock.module(require('../')));
  beforeEach(angular.mock.module('test'));


  beforeEach(angular.mock.inject(function ($injector) {
    $http         = $injector.get('$http');
    $httpBackend  = $injector.get('$httpBackend');
    $cacheFactory = $injector.get('$cacheFactory');
    httpEtag      = $injector.get('httpEtag');

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
      .whenGET('/1', ifEtagIsNot('1'))
      .respond(serverData, { 'etag': '1' });
    $httpBackend
      .whenGET('/1', ifEtagIs('1'))
      .respond(304);

    $httpBackend
      .whenGET('/1.json?x=1&y=2&y=3', ifEtagIsNot('1'))
      .respond(serverData, { 'etag': '1' });
    $httpBackend
      .whenGET('/1.json?x=1&y=2&y=3', ifEtagIs('1'))
      .respond(304);

  }));


  it('should cache ETags', function () {
    $http.get('/1.json', { etag: true })
      .cache(onCache)
      .success(onSuccess);
    $httpBackend.flush();

    $http.get('/1.json', { etag: true })
      .cache(onCache)
      .error(onError);
    $httpBackend.flush();

    onCache.should.have.been.called.once;
    onSuccess.should.have.been.called.once;
    onError.should.have.been.called.once;
  });


  it('should cache data', function () {
    var userData;

    $http({ method:'GET', url: '/1.json', etag: true })
      .cache(onCache);
    $httpBackend.flush();

    $http({ method:'GET', url: '/1.json', etag: true })
      .cache(function (data) {
        userData = data;
      });
    $httpBackend.flush();

    onCache.should.not.have.been.called();
    userData.should.deep.equal(serverData);
  });


  it('should cache data on specified cache ID', function () {
    var userData;

    $http.get('/1.json', { etag: 'test' });
    $httpBackend.flush();

    $http.get('/1.json', { etag: 'test' })
      .cache(function (data) {
        userData = data;
      })
      .error(onError);
    $httpBackend.flush();

    $http.get('/1.json', { etag: true })
      .success(onSuccess);
    $httpBackend.flush();

    userData.should.deep.equal(serverData);
    onSuccess.should.have.been.called.once;
    onError.should.have.been.called.once;
  });


  it('should function normally without ETag config property', function () {
    $http.get('/1.json').success(onSuccess);
    $httpBackend.flush();

    $http({ method: 'GET', url: '/1.json'}).error(onError);
    $httpBackend.flush();

    onSuccess.should.have.been.called.once;
    onError.should.not.have.been.called.once;
  });


  it('should cache ETags for requests with query params', function () {
    $http.get('/1.json', { etag: true, params: { x:1, y:[2, 3] } })
      .success(onSuccess);
    $httpBackend.flush();

    $http.get('/1.json', { etag: true, params: { x:1, y:[2, 3] } })
      .error(onError);
    $httpBackend.flush();

    $http.get('/1.json', { etag: true })
      .success(onSuccess);
    $httpBackend.flush();

    onSuccess.should.have.been.called.twice;
    onError.should.have.been.called.once;
  });


  it('should cache data under a specific key when a keyParser is defined', function () {
    $http.get('/1.json', { etag: 'keyParserTest' })
      .success(onSuccess);
    $httpBackend.flush();

    $http.get('/1.json', { etag: 'keyParserTest' })
      .error(onError);
    $httpBackend.flush();

    httpEtag.cacheGet('keyParserTest', '1').should.exist;
  });

  it('should fail safely if keyParser returns undefined', function () {
    $http.get('/1', { etag: 'keyParserTest' })
      .success(onSuccess);
    $httpBackend.flush();

    $http.get('/1', { etag: 'keyParserTest' })
      .error(onError);
    $httpBackend.flush();

    httpEtag.cacheGet('keyParserTest', '/1?').should.exist;
  });


  it('service should put/get to/from default cache when no id is specified', function () {
    httpEtag.cachePut('hi', 'how are you');
    httpEtag.cacheGet('hi').should.equal('how are you');
  });


});
