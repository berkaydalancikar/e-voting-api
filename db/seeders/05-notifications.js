'use strict'

module.exports = {
  up: async queryInterface => {
    const notifications = [
      {
        title: 'Welcome',
        department: 'Computer Engineering',
        content: 'Welcome to our voting system'
      },
      {
        title: 'Initial',
        department: 'Computer Engineering',
        content: 'You can follow notifications on here'
      },
      {
        title: 'Welcome',
        department: 'Architecture',
        content: 'Welcome to our voting system'
      },
      {
        title: 'Initial',
        department: 'Architecture',
        content: 'You can follow notifications on here'
      }
    ]
    await queryInterface.bulkInsert('notifications', notifications)
  },
  down: async queryInterface => {
    await queryInterface.bulkDelete('notifications', null, {})
  }
}
