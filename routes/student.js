const studentController = require('../controllers/studentController')

module.exports = async fastify => {
  const preValidation = [fastify.admin]
  fastify.post('/student/login', studentController.login)
  fastify.get('/students', { preValidation }, studentController.getStudents)
  fastify.put(
    '/students/sendActivationMail',
    { preValidation },
    studentController.sendActivationMailToPassiveStudents
  )
}
