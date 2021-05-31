const { db } = require('./baseController')
const { statuses } = require('../data/enums')

exports.startOrEndElection = async (req, res) => {
  const department = req.auth.department

  const election = await db.election.findOne({ department })

  if (election.status === statuses.PASSIVE) {
    election.status = statuses.ACTIVE
  } else {
    election.status = statuses.ACTIVE
  }

  await election.save()
  res.send(election.status)
}
