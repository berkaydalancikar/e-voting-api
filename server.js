const config = require('config')

const server = require('./app')({
  ignoreTrailingSlash: true,
  logger: {
    level: config.get('server.logSeverity'),
    prettyPrint: true
  }
})

const port =
  process.env.PORT ||
  (config.has('server.port') ? config.get('server.port') : '9003')

server.listen(port, '0.0.0.0', err => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
})
