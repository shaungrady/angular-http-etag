var packageData = require('./package.json')

export default `/**
 * ${packageData.name} v${packageData.version}
 * ${packageData.author}, ${new Date().getFullYear()}
 * ${packageData.homepage}
 * Module Format: <module_format>
 * License: ${packageData.license}
 */\n`
