import config from './rollup.config.browser.js'
import uglify from 'rollup-plugin-uglify'

config.dest = 'release/angular-http-etag.min.js',
config.plugins.push(uglify())
config.sourceMap = true

export default config
