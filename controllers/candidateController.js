const { db } = require('./baseController')

exports.getCandidates = async (req, res) => {
  const department = req.auth.department
  const candidates = await db.candidate.findAll({
    where: { department: department },
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
            'primaryDepartment'
          ]
        }
      }
    ]
  })
  res.send({ candidates })
}

exports.beCandidate = async (req, res) => {
  const { studentId, primaryDepartment } = req.auth
  let candidate = req.body

  candidate.studentId = studentId
  candidate.department = primaryDepartment

  candidate = await db.candidate.create(candidate)
  res.send()
}

exports.reject = async (req, res) => {
  const id = req.params.id

  await db.candidate.destroy({
    where: { id: parseInt(id) }
  })

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
