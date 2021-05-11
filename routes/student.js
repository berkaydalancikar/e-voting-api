const studentController = require('../controllers/studentController')

module.exports = async fastify => {
  const preValidation = [fastify.admin]
  fastify.get('/students', { preValidation }, studentController.getStudents)
  fastify.put(
    '/students/sendSetPasswordEmail',
    { preValidation },
    studentController.sendSetPasswordEmail
  )

  const authenticate = [fastify.authenticate]
  fastify.get('/students/:id', { authenticate }, studentController.getStudent)
}
