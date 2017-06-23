const { resolve } = require('path')

module.exports = {
  files: [
    resolve('node_modules/angular/angular.js'),
    resolve('node_modules/angular-mocks/angular-mocks.js'),
    resolve('src/index.js'),
    resolve('test/angular_1.6/index.js')
  ],

  coverageReporter: {
    type: 'json',
    dir: 'coverage/angular_1.6'
  }
}
