import banner from './rollup.banner.js'
import commonjs from 'rollup-plugin-commonjs'
import nodeResolve from 'rollup-plugin-node-resolve'

export default {
  banner,
  entry: 'src/index.js',
  format: 'umd',
  dest: 'release/angular-http-etag.js',
  moduleName: 'angularHttpEtag',
  plugins: [
    nodeResolve({
      jsnext: true
    }),
    commonjs({
      include: 'node_modules/**'
    })
  ],
  external: [
    'angular'
  ],
  globals: {
    angular: 'angular'
  }
}
