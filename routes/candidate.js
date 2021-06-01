const candidateController = require('../controllers/candidateController')

module.exports = async fastify => {
  const preValidation = [fastify.admin]

  fastify.delete(
    '/candidates/reject/:id',
    { preValidation },
    candidateController.reject
  )
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
  fastify.post('/student/vote/:id', { preValidation }, candidateController.vote)
}
