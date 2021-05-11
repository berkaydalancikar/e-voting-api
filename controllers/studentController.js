const config = require('config')
const { db, ApiError } = require('./baseController')
const { INVALID_PASSWORD, USER_DOES_NOT_EXIST } = require('../data/errors')
const { generateGuid } = require('../utils/crypto')

exports.login = async (req, res) => {
  const { studentId, password } = req.body
  const user = await db.student.findOne({
    where: { studentId },
    attributes: [
      'studentId',
      'name',
      'surname',
      'mail',
      'primaryDepartment',
      'secondaryDepartment',
      'status',
      'isCandidate',
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
}

exports.getStudents = async (req, res) => {
  const students = await db.student.findAndCountAll()
  res.send(students)
}

exports.getStudent = async (req, res) => {
  const id = req.auth.id
  const student = await db.student.findOne({
    where: { id }
  })
  res.send(student)
}
