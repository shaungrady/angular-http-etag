const { resolve } = require('path')
const webpack = require('webpack')

// Banner
const bannerTemplate = require(resolve(__dirname, 'webpack.banner.js'))
const banner = bannerTemplate.replace('<module_format>', 'CommonJS')

// Get externals from package.json dependencies
const externals = {}
const dependencies = Object
  .keys(require(resolve('package.json')).dependencies)
  .concat(['angular'])

dependencies.forEach((dep) => { externals[dep] = dep })

// Export config
module.exports = {
  mode: 'production',
  entry: resolve('src/index.js'),
  output: {
    path: resolve('lib'),
    filename: 'index.js',
    library: 'http-etag',
    libraryTarget: 'commonjs2'
  },
  optimization: {
    minimize: false
  },
  plugins: [
    new webpack.BannerPlugin({ banner, raw: true, entryOnly: true })
  ],
  target: 'web',
  externals,
  node: {
    process: false,
    Buffer: false,
    setImmediate: false
  }
}
