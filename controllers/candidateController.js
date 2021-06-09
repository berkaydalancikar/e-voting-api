const db = require('../db')
const { Op } = require('sequelize')
const ApiError = require('../models/ApiError')
const { electionProgress, voteStatus } = require('../data/enums')
const {
  CANNOT_BE_CANDIDATE_AT_THIS_STAGE,
  CANDIDATE_CANNOT_BE_REJECTED_AT_THIS_STAGE,
  CANNOT_VOTE_AT_THIS_STAGE,
  YOU_HAVE_ALREADY_VOTED,
  YOU_HAVE_ALREADY_CANDIDATED
} = require('../data/errors')

exports.getCandidates = async (req, res) => {
  const department = req.auth.department

  const candidates = await db.candidate.findAll({
    where: { department },
    include: [
      {
        model: db.student,
        attributes: {
          exclude: ['password', 'status', 'mail', 'department']
        }
      }
    ]
  })
  res.send({ candidates })
}

exports.beCandidate = async (req, res) => {
  const { id, department } = req.auth

  const election = await db.election.findOne({ where: { department } })

  if (election.status !== electionProgress.PRE_ELECTION) {
    throw new ApiError(CANNOT_BE_CANDIDATE_AT_THIS_STAGE)
  } else {
    const isCandidateExist = await db.candidate.findOne({
      where: { [Op.and]: [{ studentId: id }, { department }] }
    })

    if (!isCandidateExist) {
      let candidate = req.body

      candidate.studentId = id
      candidate.department = department

      candidate = await db.candidate.create(candidate)
    } else {
      throw new ApiError(YOU_HAVE_ALREADY_CANDIDATED)
    }
  }
  res.send({ election })
}

exports.reject = async (req, res) => {
  const id = req.params.id
  const department = req.auth.department

  const election = await db.election.findOne({ where: { department } })

  if (election.status !== electionProgress.PRE_ELECTION) {
    throw new ApiError(CANDIDATE_CANNOT_BE_REJECTED_AT_THIS_STAGE)
  } else {
    await db.candidate.destroy({
      where: { id: parseInt(id) }
    })
  }
  res.send({ election })
}

exports.vote = async (req, res) => {
  const { id, department } = req.auth
  const candidateId = req.params.id

  const election = await db.election.findOne({
    where: { department },
    attributes: { exclude: ['department'] }
  })

  if (election.status !== electionProgress.PERI_ELECTION) {
    throw new ApiError(CANNOT_VOTE_AT_THIS_STAGE)
  } else {
    const voter = await db.student.findOne({
      where: { id },
      attributes: {
        exclude: [
          'name',
          'surname',
          'mail',
          'password',
          'department',
          'status',
          'studentId',
          'grade',
          'gpa',
          'fullname'
        ]
      }
    })
    if (voter.hasVoted === voteStatus.YES) {
      throw new ApiError(YOU_HAVE_ALREADY_VOTED)
    } else {
      const candidate = await db.candidate.findOne({
        where: { id: parseInt(candidateId) },
        attributes: {
          exclude: ['studentId', 'department', 'description']
        }
      })
      voter.hasVoted = voteStatus.YES
      candidate.votes = candidate.votes + 1

      await candidate.save()
      await voter.save()
    }
  }

  res.send({ election })
}
