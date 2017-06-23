const { resolve } = require('path')

module.exports = {
  files: [
    resolve('test/angular_1.5/vendor/angular.js'),
    resolve('test/angular_1.5/vendor/angular-mocks.js'),
    resolve('src/index.js'),
    resolve('test/angular_1.5/index.js')
  ],

  coverageReporter: {
    type: 'json',
    dir: 'coverage/angular_1.5'
  }
}
