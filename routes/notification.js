const notificationController = require('../controllers/notificationController')

module.exports = async fastify => {
  const preValidation = [fastify.admin]
  fastify.get(
    '/all-notifications',
    { preValidation },
    notificationController.getNotifications
  )
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

  const authenticate = [fastify.authenticate]
  fastify.get(
    '/notifications/:id',
    { authenticate },
    notificationController.getNotification
  )
  fastify.get(
    '/notifications',
    { authenticate },
    notificationController.getNotificationsByDepartment
  )
}
