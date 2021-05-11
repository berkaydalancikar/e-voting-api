const config = require('config')
const env = process.env.NODE_ENV || 'development'
const databaseConfig = {}
databaseConfig[env] = config.db.config
module.exports = databaseConfig
