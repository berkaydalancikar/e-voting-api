'use strict'

module.exports = {
  up: async queryInterface => {
    const emailTemplates = [
      { name: 'activate-student', subject: 'Student Activation' }
    ]

    await queryInterface.bulkInsert('emailTemplates', emailTemplates)
  },

  down: async queryInterface => {
    await queryInterface.bulkDelete('emailTemplates', null, {})
  }
}
