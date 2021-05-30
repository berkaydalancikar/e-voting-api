'use strict'

module.exports = {
  up: async queryInterface => {
    const candidates = [
      {
        studentId: '1111111111',
        department: 'Computer Engineering',
        description: 'Description-1'
      },
      {
        studentId: '2222222222',
        department: 'Computer Engineering',
        description: 'Description-2'
      },
      {
        studentId: '3333333333',
        department: 'Architecture',
        description: 'Description-3'
      },
      {
        studentId: '4444444444',
        department: 'Computer Engineering',
        description: 'Description-4'
      }
    ]
    await queryInterface.bulkInsert('candidates', candidates)
  },
  down: async queryInterface => {
    await queryInterface.bulkDelete('candidates', null, {})
  }
}
