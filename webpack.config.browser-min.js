const webpack = require('webpack')
const config = require('./webpack.config.browser.js')
const banner = require('./webpack.banner-min.js')

// Modify plugins for minification
config.output.filename = 'angular-http-etag.min.js'
config.output.libraryTarget = 'umd'
config.devtool = 'source-map'
config.plugins = [
  new webpack.optimize.UglifyJsPlugin({
    sourceMap: true
  }),
  new webpack.BannerPlugin({ banner, raw: true, entryOnly: true })
]

module.exports = config
