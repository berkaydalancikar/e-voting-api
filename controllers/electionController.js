const db = require('../db')
const { electionProgress } = require('../data/enums')

exports.getElectionStatus = async (req, res) => {
  const department = req.auth.department

  const election = await db.election.findOne({ where: { department } })

  const status = election.status

  res.send({ status })
}

exports.startOrEndElection = async (req, res) => {
  const department = req.auth.department

  const election = await db.election.findOne({ where: { department } })

  if (election.status === electionProgress.IDLE) {
    election.status = electionProgress.PRE_ELECTION
  } else if (election.status === electionProgress.PRE_ELECTION) {
    election.status = electionProgress.PERI_ELECTION
  } else if (election.status === electionProgress.PERI_ELECTION) {
    election.status = electionProgress.POST_ELECTION
  } else {
    election.status = electionProgress.IDLE
  }

  await election.save()
  res.send({ election })
}
