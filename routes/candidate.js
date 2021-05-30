const candidateController = require('../controllers/candidateController')

module.exports = async fastify => {
  const preValidation = [fastify.authenticate]
  const authentication = [fastify.admin]

  fastify.get(
    '/candidates',
    { preValidation },
    candidateController.getCandidates
  )
  fastify.post(
    '/student/beCandidate',
    { preValidation },
    candidateController.beCandidate
  )
  fastify.delete(
    '/candidates/reject/:id',
    { authentication },
    candidateController.reject
  )
}
