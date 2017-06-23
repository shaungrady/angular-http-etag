const { resolve } = require('path')
const packageData = require(resolve('package.json'))

module.exports = `// ${packageData.name} v${packageData.version}`
