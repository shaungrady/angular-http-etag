/* global angular:false */

'use strict'

var chai = require('chai')
chai.should()

describe('angular-http-etag', function () {
  describe('[Angular 1.5]', function () {
    it('should be the correct Angular version', function () {
      angular.version.major.should.equal(1)
      angular.version.minor.should.equal(5)
    })

    require('./serviceProvider')
    require('./service')
    require('./httpDecorator')
  })
})
