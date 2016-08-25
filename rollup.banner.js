var packageData = require('./package.json')

export default `/**
 * ${packageData.name} v${packageData.version}
 * ${packageData.author}, ${new Date().getFullYear()}
 * ${packageData.homepage}
 * Module: Universal Module Definition
 * License: ${packageData.license}
 */\n`
