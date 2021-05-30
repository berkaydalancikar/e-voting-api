const config = require('config')
const { db, ApiError } = require('./baseController')
const { INVALID_PASSWORD, USER_DOES_NOT_EXIST } = require('../data/errors')
const { generateGuid } = require('../utils/crypto')

exports.login = async (req, res) => {
  const { studentId, password } = req.body
  const user = await db.student.findOne({
    where: { studentId },
    attributes: [
      'id',
      'studentId',
      'name',
      'surname',
      'mail',
      'password',
      'primaryDepartment',
      'status',
      'hasVoted'
    ]
  })

  if (!user) {
    throw new ApiError(USER_DOES_NOT_EXIST)
  }

  const isPasswordMatch = await db.student.methods.comparePassword(
    password,
    user.password
  )

  if (!isPasswordMatch) {
    throw new ApiError(INVALID_PASSWORD)
  }

  const { id, primaryDepartment, status, hasVoted } = user
  const token = await res.jwtSign({
    id,
    studentId,
    primaryDepartment,
    status,
    hasVoted
  })

  return res.send(token)
}

exports.getStudents = async (req, res) => {
  const department = req.auth.department
  const students = await db.student.findAll({
    where: { primaryDepartment: department },
    attributes: { exclude: ['password'] }
  })
  res.send({ students })
}

exports.getStudent = async (req, res) => {
  const id = req.auth.id
  const student = await db.student.findOne({
    where: { id }
  })
  res.send(student)
}
