const fs = require('fs')
const path = require('path')
const handlebars = require('handlebars')
const {
  EMAIL_TEMPLATE_NOT_FOUND,
  EMAIL_TEMPLATE_VERIFY_ERROR
} = require('../../data/errors')

module.exports = function (sequelize, DataTypes) {
  const emailTemplate = sequelize.define(
    'emailTemplate',
    {
      name: DataTypes.STRING,
      subject: DataTypes.STRING
    },
    {
      timestamps: false
    }
  )

  const getEmailTemplate = async (name, params) => {
    const source = await emailTemplate.findOne({ where: { name } })

    if (!source) {
      throw new Error(EMAIL_TEMPLATE_NOT_FOUND.message)
    }

    const content = fs.readFileSync(
      path.join(__dirname, `../../templates/email/${name}.html`),
      'utf8'
    )

    return {
      message: handlebars.compile(content)(params),
      subject: handlebars.compile(source.subject)(params)
    }
  }

  emailTemplate.methods = {
    generateStudentActivationEmail: async ({
      fullname,
      email,
      verifyUrl,
      token
    }) => {
      try {
        const emailVerificationURL = `${verifyUrl}?token=${token}`
        const emailTemplate = await getEmailTemplate('activate-student', {
          fullname,
          emailVerificationURL
        })

        return {
          sender: '',
          recipient: email,
          subject: emailTemplate.subject,
          mailContent: emailTemplate.message
        }
      } catch (err) {
        throw new Error(EMAIL_TEMPLATE_VERIFY_ERROR.message)
      }
    }
  }

  return emailTemplate
}
