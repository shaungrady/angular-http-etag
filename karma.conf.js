// Determine which version of Angular we're running the tests for. (--ng 1.6)
const args = process.argv.slice(2)
let index = args.indexOf('--ng')
const ngVersion = index > -1 ? args[index + 1] : '1.6'
const ngConfig = require(`./test/karma.config.angular-${ngVersion}.js`)
console.log('Karma: Running tests for Angular', ngVersion)

// Config
module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['mocha'],
    files: ngConfig.files,
    exclude: [],

    preprocessors: {
      'src/index.js': ['webpack', 'sourcemap'],
      'test/**/index.js': ['webpack', 'sourcemap']
    },

    webpack: {
      externals: {
        angular: 'angular'
      },
      devtool: 'inline-source-map'
    },
    webpackMiddleware: {
      stats: 'minimal'
    },

    reporters: ['progress'],
    port: 9876,
    colors: true,
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['PhantomJS'],
    singleRun: true,
    concurrency: Infinity
  })
}
