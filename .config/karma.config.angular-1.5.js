const { resolve } = require('path')

console.log('\n\x1b[36m%s\x1b[0m', 'Karma: Running tests for angular@1.5')

module.exports = {
  files: [
    resolve('test/angular_1.5/vendor/angular.js'),
    resolve('test/angular_1.5/vendor/angular-mocks.js'),
    resolve('src/index.js'),
    resolve('test/angular_1.5/index.js')
  ],

  coverageReporter: {
    type: 'json',
    dir: resolve('coverage/angular_1.5')
  }
}
