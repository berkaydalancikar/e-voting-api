const db = require('../db')
const ApiError = require('../models/ApiError')
const { electionProgress } = require('../data/enums')
const {
  CANNOT_BE_CANDIDATE_AT_THIS_STAGE,
  CANDIDATE_CANNOT_BE_REJECTED_AT_THIS_STAGE,
  CANNOT_VOTE_AT_THIS_STAGE
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

  if (election.status !== electionProgress.PRE_ELECTION) {
    throw new ApiError(CANNOT_BE_CANDIDATE_AT_THIS_STAGE)
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

  if (election.status !== electionProgress.PERI_ELECTION) {
    throw new ApiError(CANDIDATE_CANNOT_BE_REJECTED_AT_THIS_STAGE)
  } else {
    await db.candidate.destroy({
      where: { id: parseInt(id) }
    })
  }
  res.send()
}

exports.vote = async (req, res) => {
  const department = req.auth.department
  const election = await db.election.findOne({ where: { department } })

  if (election.status !== electionProgress.PERI_ELECTION) {
    throw new ApiError(CANNOT_VOTE_AT_THIS_STAGE)
  } else {
    const candidateId = req.params.id
    const candidate = db.candidate.findOne({ where: { id: candidateId } })
    candidate.votes = candidate.votes + 1

    await candidate.save()
  }

  res.send()
}
