'use strict'

module.exports = {
  up: async queryInterface => {
    const elections = [
      {
        department: 'Computer Engineering'
      },
      {
        department: 'Architecture'
      }
    ]
    await queryInterface.bulkInsert('elections', elections)
  },
  down: async queryInterface => {
    await queryInterface.bulkDelete('elections', null, {})
  }
}
