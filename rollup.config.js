import bannerTemplate from './rollup.banner.js'

let banner = bannerTemplate.replace('<module_format>', 'CommonJS')
let external = Object.keys(require('./package.json').dependencies).concat(['angular'])

export default {
  banner,
  external,
  entry: 'src/index.js',
  format: 'cjs',
  dest: 'lib/index.js',
  moduleName: 'http-etag',
  globals: {
    angular: 'angular'
  }
}
