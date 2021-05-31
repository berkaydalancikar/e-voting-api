const electionController = require('../controllers/electionController')

module.exports = async fastify => {
  const preValidation = [fastify.admin]

  fastify.get(
    '/electionStatus',
    { preValidation },
    electionController.startOrEndElection
  )
}
