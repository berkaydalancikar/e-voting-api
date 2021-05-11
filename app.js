const Fastify = require('fastify')
const path = require('path')
const AutoLoad = require('fastify-autoload')
const config = require('config')
const jwt = require('fastify-jwt')
const cors = require('fastify-cors')
const formBody = require('fastify-formbody')
const multipart = require('fastify-multipart')

const ApiError = require('./models/ApiError')
const { NO_AUTHORIZATION } = require('./data/errors')

const build = (opts = {}) => {
  const app = Fastify(opts)

  app.register(formBody)
  app.register(multipart)
  app.register(AutoLoad, {
    dir: path.join(__dirname, 'routes')
  })
  app.register(jwt, {
    secret: config.get('secrets.jwt')
  })
  app.register(cors, {
    origin: true
  })

  const authenticate = async request => {
    const auth = await request.jwtVerify()
    request.auth = auth
  }

  app.decorate('authenticate', async function (request) {
    await authenticate(request)
  })

  app.decorate('admin', async function (request) {
    await authenticate(request)
  })

  return app
}

module.exports = build
