const studentController = require('../controllers/studentController')

module.exports = async fastify => {
  const preValidation = [fastify.admin]
  fastify.post('/student/login', studentController.login)
  fastify.post('/activate', studentController.activate)
  fastify.post('/reset-password', studentController.resetPassword)
  fastify.get('/students', { preValidation }, studentController.getStudents)
  fastify.put(
    '/students/sendActivationMail',
    { preValidation },
    studentController.sendActivationMail
  )
  fastify.put(
    '/updateStudentPassword',
    { preValidation },
    studentController.updatePassword
  )
  fastify.get(
    '/student/isPassive',
    { preValidation },
    studentController.isPassiveUser
  )
  fastify.get(
    '/students/deleteAll',
    { preValidation },
    studentController.deleteAll
  )
  fastify.get('/student/activate/isPassive', studentController.isPassiveUser)
  fastify.post('/student/forgot-password', studentController.forgotPassword)
  fastify.post(
    '/students/bulk',
    { preValidation },
    studentController.createStudentsBulk
  )
}
