'use strict'

module.exports = {
  up: async queryInterface => {
    const emailTemplates = [
      { name: 'activate-student', subject: 'Student Activation' },
      { name: 'reset-password', subject: 'Reset Password' }
    ]

    await queryInterface.bulkInsert('emailTemplates', emailTemplates)
  },

  down: async queryInterface => {
    await queryInterface.bulkDelete('emailTemplates', null, {})
  }
}
