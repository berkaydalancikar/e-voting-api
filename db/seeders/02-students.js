'use strict'

const { hashPassword } = require('../../utils/crypto')

module.exports = {
  up: async queryInterface => {
    const password = await hashPassword('student')

    const students = [
      {
        id: 1,
        studentId: '1111111111',
        name: 'Computer',
        surname: 'Student 1',
        mail: '1111111111@stu.iku.edu.tr',
        password: password,
        department: 'Computer Engineering',
        grade: 4,
        gpa: 3.0
      },
      {
        id: 2,
        studentId: '2222222222',
        name: 'Computer',
        surname: 'Student 2',
        mail: '2222222222@stu.iku.edu.tr',
        password: password,
        department: 'Computer Engineering',
        grade: 4,
        gpa: 2.5
      },
      {
        id: 3,
        studentId: '3333333333',
        name: 'Architecture',
        surname: 'Student 1',
        mail: '3333333333@stu.iku.edu.tr',
        password: password,
        department: 'Architecture',
        grade: 4,
        gpa: 2.5
      },
      {
        id: 4,
        studentId: '4444444444',
        name: 'Computer',
        surname: 'Student 3',
        mail: '4444444444@stu.iku.edu.tr',
        password: password,
        department: 'Computer Engineering',
        grade: 4,
        gpa: 2.5
      }
    ]
    await queryInterface.bulkInsert('students', students)
  },
  down: async queryInterface => {
    await queryInterface.bulkDelete('students', null, {})
  }
}
