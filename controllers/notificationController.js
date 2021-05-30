const { db, Op } = require('./baseController')

exports.getNotifications = async (req, res) => {
  const department = req.auth.department
  const notifications = await db.notification.findAll({
    where: { department }
  })
  res.send({ notifications })
}

exports.getNotification = async (req, res) => {
  const id = req.params.id
  const department = req.auth.department
  const notification = await db.notification.findOne({
    where: {
      [Op.and]: [{ id: parseInt(id) }, { department }]
    }
  })
  res.send(notification)
}

exports.createNotification = async (req, res) => {
  const department = req.auth.department
  let notification = req.body
  notification.department = department
  notification = await db.notification.create(notification)
  res.send(notification)
}

exports.deleteNotification = async (req, res) => {
  const id = req.params.id
  const department = req.auth.department
  await db.notification.destroy({
    where: {
      [Op.and]: [{ id: parseInt(id) }, { department }]
    }
  })

  res.send()
}
