'use strict'

module.exports = {
  up: async queryInterface => {
    const candidates = [
      {
        studentId: '2',
        department: 'Computer Engineering',
        description: 'Description-2'
      },
      {
        studentId: '1',
        department: 'Architecture',
        description: 'Description-3'
      },
      {
        studentId: '4',
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
