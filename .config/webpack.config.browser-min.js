const { resolve } = require('path')
const webpack = require('webpack')
const config = require(resolve(__dirname, 'webpack.config.browser.js'))
const banner = require(resolve(__dirname, 'webpack.banner-min.js'))

// Modify plugins for minification
config.output.filename = 'angular-http-etag.min.js'
config.output.libraryTarget = 'umd'
config.devtool = 'source-map'
config.optimization.minimize = true
config.plugins = [
  new webpack.BannerPlugin({ banner, raw: true, entryOnly: true })
]

module.exports = config
