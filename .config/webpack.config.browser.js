const { resolve } = require('path')
const webpack = require('webpack')
const config = require(resolve(__dirname, 'webpack.config.js'))

// Banner
const bannerTemplate = require(resolve(__dirname, 'webpack.banner.js'))
const banner = bannerTemplate.replace('<module_format>', 'Universal Module Definition')

// Modify config for browser
config.output.path = resolve('release')
config.output.filename = 'angular-http-etag.js'
config.output.libraryTarget = 'umd'
config.externals = ['angular']
config.plugins = [
  new webpack.BannerPlugin({ banner, raw: true, entryOnly: true })
]

module.exports = config
