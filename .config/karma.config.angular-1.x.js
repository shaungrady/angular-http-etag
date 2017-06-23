const { resolve } = require('path')

console.log('\n\x1b[36m%s\x1b[0m', 'Karma: Running tests for angular@1.x')

module.exports = {
  files: [
    resolve('node_modules/angular/angular.js'),
    resolve('node_modules/angular-mocks/angular-mocks.js'),
    resolve('src/index.js'),
    resolve('test/angular_1.x/index.js')
  ],

  coverageReporter: {
    type: 'json',
    dir: resolve('coverage/angular_1.x')
  }
}
