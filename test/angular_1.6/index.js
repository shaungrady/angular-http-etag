'use strict'

if (angular) {
  var key = 'ng' + angular.version.major + '.' + angular.version.minor
  window[key] = angular
  window.angular = {}
}

require('angular/angular.js')
require('angular-mocks/angular-mocks.js')
// require('../../release/angular-http-etag.js')

var chai = require('chai')
chai.should()

describe('angular-http-etag', function () {
  describe('[Angular 1.6]', function () {
    it('should be the correct Angular version', function () {
      angular.version.major.should.equal(1)
      angular.version.minor.should.equal(6)
    })
  })
})
