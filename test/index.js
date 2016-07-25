'use strict'

require('angular')
require('angular-mocks/ngMock')

describe('angular-http-etag', function () {
  describe('Service Provider', function () {
    require('./serviceProvider')
  })

  describe('Service', function () {
    require('./service')
  })

  describe('HTTP Decorator', function () {
    require('./httpDecorator')
  })
})
