'use strict'

const { hashPassword } = require('../../utils/crypto')

module.exports = {
  up: async queryInterface => {
    const password = await hashPassword('admin')

    const admins = [
      {
        username: 'Computer Engineering',
        department: 'Computer Engineering',
        password: password
      },
      {
        username: 'Statistics',
        department: 'Statistics',
        password: password
      }
    ]
    await queryInterface.bulkInsert('admins', admins)
  },
  down: async queryInterface => {
    await queryInterface.bulkDelete('admins', null, {})
  }
}
