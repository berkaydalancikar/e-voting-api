const adminController = require('../controllers/adminController')

module.exports = async fastify => {
  const preValidation = [fastify.admin]
  fastify.post('/login', adminController.login)
  fastify.put('/profile/:id', { preValidation }, adminController.updatePassword)
}
