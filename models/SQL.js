const Pool = require('pg').Pool
const newPool = config => new Pool(config)

module.exports.client = newPool