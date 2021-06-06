const electionController = require('../controllers/electionController')

module.exports = async fastify => {
  const preValidation = [fastify.admin]

  fastify.get(
    '/updateElectionStatus',
    { preValidation },
    electionController.startOrEndElection
  )
  fastify.get(
    '/getElectionStatus',
    { preValidation },
    electionController.getElectionStatus
  )
}
