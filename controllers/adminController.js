// const config = require('config')
const db = require('../db')
const ApiError = require('../models/ApiError')
const { userStatuses } = require('../data/enums')
const {
  INVALID_PASSWORD,
  USER_DOES_NOT_EXIST,
  OLD_PASSWORD_NOT_MATCH
} = require('../data/errors')

exports.login = async (req, res) => {
  const { username, password } = req.body
  const user = await db.admin.findOne({
    where: { username },
    attributes: ['id', 'username', 'department', 'password', 'status']
  })

  if (!user) {
    throw new ApiError(USER_DOES_NOT_EXIST)
  }

  const isPasswordMatch = await db.admin.methods.comparePassword(
    password,
    user.password
  )
  if (!isPasswordMatch) {
    throw new ApiError(INVALID_PASSWORD)
  }

  const { id, department } = user
  const token = await res.jwtSign(
    {
      id,
      department
    }
    //  { expiresIn: config.get('app.adminJwtExpiry') }
  )

  isOldPassword = user.status === userStatuses.PASSIVE

  return res.send({ token, isOldPassword })
}

exports.isPassiveUser = async (req, res) => {
  const { id } = req.auth

  const admin = await db.admin.findOne({ where: { id } })

  if (admin.status === userStatuses.PASSIVE) {
    res.send({ result: true })
  } else {
    res.send({ result: false })
  }
}

exports.updatePassword = async (req, res) => {
  const { id } = req.auth
  let { oldPassword, password } = req.body
  const user = await db.admin.findOne({
    where: { id }
  })
  const isOldPasswordMatch = await db.admin.methods.comparePassword(
    oldPassword,
    user.password
  )
  if (!isOldPasswordMatch) {
    throw new ApiError(OLD_PASSWORD_NOT_MATCH)
  }
  user.password = password
  user.status = userStatuses.ACTIVE

  await user.save()
  res.send({ result: 'ok' })
}
