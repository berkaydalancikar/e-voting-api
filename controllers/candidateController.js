const db = require('../db')
const ApiError = require('../models/ApiError')
const { statuses } = require('../data/enums')
const {
  ELECTION_IS_NOT_ACTIVE,
  CANDIDATE_CANNOT_BE_REJECTED_DURING_ELECTION
} = require('../data/errors')

exports.getCandidates = async (req, res) => {
  const department = req.auth.department
  const candidates = await db.candidate.findAll({
    where: { department },
    include: [
      {
        model: db.student,
        attributes: {
          exclude: [
            'password',
            'hasVoted',
            'status',
            'studentId',
            'mail',
            'department'
          ]
        }
      }
    ]
  })
  res.send({ candidates })
}

exports.beCandidate = async (req, res) => {
  const { studentId, department } = req.auth

  const election = await db.election.findOne({ department })

  if (election.status === statuses.PASSIVE) {
    throw new ApiError(ELECTION_IS_NOT_ACTIVE)
  } else {
    let candidate = req.body

    candidate.studentId = studentId
    candidate.department = department

    candidate = await db.candidate.create(candidate)
  }
  res.send()
}

exports.reject = async (req, res) => {
  const id = req.params.id
  const department = req.auth.department

  const election = await db.election.findOne({ where: { department } })

  if (election.status === statuses.ACTIVE) {
    throw new ApiError(CANDIDATE_CANNOT_BE_REJECTED_DURING_ELECTION)
  } else {
    await db.candidate.destroy({
      where: { id: parseInt(id) }
    })
  }
  res.send()
}

exports.vote = async (req, res) => {
  const id = req.params.id

  const candidate = await db.candidate.findOne({
    where: { id: parseInt(id) }
  })

  candidate.vote = candidate.vote + 1

  res.send()
}
