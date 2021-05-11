const { db, Op } = require('./baseController')

exports.getNotifications = async (req, res) => {
  const notifications = await db.notification.findAll()
  res.send(notifications)
}

exports.getNotification = async (req, res) => {
  const id = req.params.id
  const notification = await db.notification.findOne({
    where: { id: parseInt(id) }
  })
  res.send(notification)
}

exports.getNotificationsByDepartment = async (req, res) => {
  const department = req.body.department
  const notifications = await db.notification.findAll({
    where: { department }
  })
  res.send(notifications)
}

exports.createNotification = async (req, res) => {
  let notification = req.body
  notification = await db.notification.create(notification)
  res.send(notification)
}

exports.deleteNotification = async (req, res) => {
  const id = req.params.id
  await db.notification.destroy({
    where: { id: parseInt(id) }
  })

  res.send()
}
