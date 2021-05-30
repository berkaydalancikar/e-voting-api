const config = require('config')
const { db, ApiError } = require('./baseController')
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

  const { id, department, status } = user
  const token = await res.jwtSign(
    {
      id,
      department,
      status
    }
    /*    { expiresIn: config.get('app.adminJwtExpiry') }   */
  )

  isOldPassword = user.status === 'passive'

  return res.send({ token, isOldPassword })
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
  user.status = 'active'

  await user.save()
  res.send()
}
