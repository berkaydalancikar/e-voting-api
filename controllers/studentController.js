// const config = require('config')
const db = require('../db')
const ApiError = require('../models/ApiError')
const { INVALID_PASSWORD, USER_DOES_NOT_EXIST } = require('../data/errors')
// const { generateGuid } = require('../utils/crypto')

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
      'department',
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

  const { id, department, status, hasVoted } = user
  const token = await res.jwtSign({
    id,
    studentId,
    department,
    status,
    hasVoted
  })

  return res.send(token)
}

exports.getStudents = async (req, res) => {
  const department = req.auth.department
  const students = await db.student.findAll({
    where: { department },
    attributes: {
      exclude: ['password', 'gpa', 'grade', 'department']
    }
  })
  res.send({ students })
}
