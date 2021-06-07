const config = require('config')
const db = require('../db')
const ApiError = require('../models/ApiError')
const { INVALID_PASSWORD, USER_DOES_NOT_EXIST } = require('../data/errors')
const { sendEmail } = require('./../utils/mail')
const { generateGuid } = require('../utils/crypto')
const { Op } = require('sequelize')
const { userStatuses } = require('../data/enums')
const { RESET_PASSWORD_MAIL_SENT } = require('../data/messages')

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

exports.activate = async (req, res) => {
  const { password, token } = req.body

  const userToken = await db.studentToken.findOne({ where: { token } })

  const student = await db.student.findOne({ id: userToken.studentId })

  if (!student) {
    throw new ApiError(USER_DOES_NOT_EXIST)
  } else if (student.status === userStatuses.ACTIVE) {
    throw new ApiError(USER_EXISTS_AND_ACTIVE)
  }

  student.password = password
  student.status = userStatuses.ACTIVE

  await student.save()

  res.send({ status: student.status })
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
  const url = req.body

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

  res.send({ students })
}

exports.forgotPassword = async (req, res) => {
  const { mail, url } = req.body

  const student = await db.findOne({
    where: { [Op.and]: [{ mail }, { status: userStatuses.ACTIVE }] }
  })

  if (!student) {
    throw new ApiError(USER_DOES_NOT_EXIST)
  }

  const token = generateGuid()
  const resetPasswordToken = {
    studentId: student.id,
    token
  }

  const verifyUrl = `${url}${config.get('clientApp.resetPasswordPath')}`

  await db.sequelize.transaction(async transaction => {
    await db.resetPasswordToken.create(resetPasswordToken, { transaction })
    await createResetPasswordMailAndSend(student, token, verifyUrl)
  })

  res.send({
    mail: student.mail,
    message: RESET_PASSWORD_MAIL_SENT
  })
}

exports.updatePassword = async (req, res) => {
  const { id } = req.auth
  let { oldPassword, password } = req.body
  const user = await db.student.findOne({
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

const createResetPasswordMailAndSend = async (student, token, verifyUrl) => {
  const {
    mailContent,
    recipient,
    subject
  } = await db.emailTemplate.methods.generateResetPasswordMail({
    mail: student.mail,
    token,
    verifyUrl,
    fullname: student.fullname
  })

  await sendEmail({
    to: recipient,
    html: mailContent,
    subject
  })
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
