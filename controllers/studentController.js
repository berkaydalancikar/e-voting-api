const config = require('config')
const XLSX = require('xlsx')
const db = require('../db')
const ApiError = require('../models/ApiError')
const {
  INVALID_PASSWORD,
  USER_DOES_NOT_EXIST,
  TOKEN_EXPIRED
} = require('../data/errors')
const { sendEmail } = require('./../utils/mail')
const { isExpired } = require('./../utils/commonUtils')
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
      'name',
      'studentId',
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

  const { id, department } = user
  const token = await res.jwtSign(
    {
      id,
      studentId,
      department
    },
    { expiresIn: config.get('app.userJwtExpiry') }
  )

  return res.send({ token })
}

exports.isPassiveUser = async (req, res) => {
  const { id } = req.auth

  const student = await db.student.findOne({ where: { id } })

  if (student.status === userStatuses.PASSIVE) {
    res.send({ result: true })
  } else {
    res.send({ result: false })
  }
}

exports.activate = async (req, res) => {
  const { password, token } = req.body

  const userToken = await db.studentToken.findOne({ where: { token } })

  const studentTokenExpiry = config.get('app.studentTokenExpiry')

  if (isExpired(userToken.createdAt, studentTokenExpiry)) {
    throw new ApiError(TOKEN_EXPIRED)
  }
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

exports.createStudentsBulk = async (req, res) => {
  const { department } = req.auth
  const fileData = req.file()
  const studentData = getStudentDataFromExcel(fileData)

  const students = []
  for (const item of studentData) {
    const student = {
      studentId: item.studentId,
      name: item.name,
      surname: item.surname,
      mail: item.mail,
      department: item.department,
      grade: item.grade,
      gpa: item.gpa
    }

    students.push(student)
  }

  await db.sequelize.transaction(async transaction => {
    const fileName = await uploadFile({
      file: fileData,
      folder: nodeUtil.format(STUDENT_IMPORT_FOLDER, department)
    })
    const studentImport = await db.studentImport.create(
      {
        fileName,
        createdByDepartment: department
      },
      { transaction }
    )
  })

  await db.student.bulkCreate(students, {
    transaction,
    updateOnDuplicate: [
      'studentId',
      'name',
      'surname',
      'mail',
      'department',
      'grade',
      'gpa'
    ]
  })

  res.send()
}

const getStudentDataFromExcel = fileData => {
  const workbook = XLSX.read(fileData.file.readableBuffer.head.data, {
    type: 'buffer'
  })
  const jsonRows = XLSX.utils.sheet_to_json(
    workbook.Sheets[workbook.SheetNames[0]]
  )
  const studentData = jsonRows.map(
    ({
      'Student ID': studentId,
      Name: name,
      Surname: surname,
      Mail: mail,
      Department: department,
      Grade: grade,
      GPA: gpa
    }) => {
      return {
        studentId,
        name,
        surname,
        mail,
        department,
        grade,
        gpa
      }
    }
  )

  return studentData
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
