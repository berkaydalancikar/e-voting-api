const config = require('config')
const db = require('../db')
const ApiError = require('../models/ApiError')
const { INVALID_PASSWORD, USER_DOES_NOT_EXIST } = require('../data/errors')
const { sendEmail } = require('./../utils/mail')
const { generateGuid } = require('../utils/crypto')
const { Op } = require('sequelize')
const { userStatuses } = require('../data/enums')

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
    department
  })

  return res.send({ token })
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

exports.sendActivationMail = async (req, res) => {
  const { department } = req.auth
  const { url } = req.body

  const students = await db.student.findAll({
    where: { [Op.and]: [{ department }, { status: userStatuses.PASSIVE }] },
    attributes: {
      exclude: ['password', 'gpa', 'grade', 'hasVoted']
    }
  })

  Promise.all(
    students.map(async students => {
      const studentToken = await db.studentToken.create({
        studentId: students.id,
        token: generateGuid()
      })

      const verifyUrl = `${url}${config.get('clientApp.activateStudentPath')}`

      await createEmailVerifyTokenAndSendMail(students, studentToken, verifyUrl)
    })
  )

  res.send()
}

const createEmailVerifyTokenAndSendMail = async (
  student,
  studentToken,
  verifyUrl
) => {
  const {
    mailContent,
    recipient,
    subject
  } = await db.emailTemplate.methods.generateStudentActivationEmail({
    fullname: student.fullname,
    email: student.mail,
    verifyUrl,
    token: studentToken.token
  })

  await sendEmail({
    to: recipient,
    html: mailContent,
    subject
  })
}
