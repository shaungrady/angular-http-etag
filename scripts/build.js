// This script creates a standalone UMD file then creates a minified version
// that includes a sourcemap.

var process = require('process')
var fs = require('fs')
var path = require('path')
var browserify = require('browserify')
var uglifyJs = require('uglify-js')

process.chdir('./release')

var packageData = require('../package.json')
var bundleFile = path.join('./', 'angular-http-etag.js')
var minBundleFile = path.join('./', 'angular-http-etag.min.js')
var mapBundleFile = path.join('./', 'angular-http-etag.min.map')
var bundleHeader =
`/**
 * ${packageData.name} v${packageData.version}
 * ${packageData.author}, ${new Date().getFullYear()}
 * ${packageData.homepage}
 * Module: Universal Module Definition
 * License: ${packageData.license}
 */\n\n`

var writeSteam = fs.createWriteStream(bundleFile, 'utf8')
writeSteam.write(bundleHeader)

// UMD Bundle
browserify({ standalone: 'angularHttpEtag' })
  .require('../src/', { entry: true })
  .transform('exposify', { expose: {
    angular: 'angular'
  }})
  .plugin('derequire/plugin')
  .bundle()
  .pipe(writeSteam)
  .on('finish', function () {
    // Minify
    var result = uglifyJs
      .minify([bundleFile], {
        output: {
          preamble: bundleHeader.substr(0, bundleHeader.length - 1)
        },
        outSourceMap: 'angular-http-etag.min.map'
      })

    fs.writeFileSync(minBundleFile, result.code, 'utf8')
    fs.writeFileSync(mapBundleFile, result.map, 'utf8')
  })
