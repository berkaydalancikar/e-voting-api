const config = require('config')
const mailConfig = config.get('mail')
const nodemailer = require('nodemailer')

const send = async ({ from, to, bcc, subject, html, attachments, options }) => {
  const transporter = nodemailer.createTransport(options)

  await transporter.sendMail({
    from,
    to,
    bcc,
    subject,
    html,
    attachments
  })
}

const sendEmail = async ({ to, bcc, subject, html, attachments }) => {
  const displayName = mailConfig.displayName
  const from = `${displayName} <${mailConfig.options.auth.user}>`
  const options = mailConfig.options
  await send({
    from,
    to,
    bcc,
    subject,
    html,
    attachments,
    options
  })
}

module.exports = {
  sendEmail
}
