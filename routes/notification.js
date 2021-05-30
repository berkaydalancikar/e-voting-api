const notificationController = require('../controllers/notificationController')

module.exports = async fastify => {
  const preValidation = [fastify.admin]
  fastify.post(
    '/notifications',
    { preValidation },
    notificationController.createNotification
  )
  fastify.delete(
    '/notifications/:id',
    { preValidation },
    notificationController.deleteNotification
  )
  fastify.get(
    '/notifications',
    { preValidation },
    notificationController.getNotifications
  )
  fastify.get(
    '/notifications/:id',
    { preValidation },
    notificationController.getNotification
  )
}
