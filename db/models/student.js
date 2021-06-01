const { hashPassword, comparePassword } = require('../../utils/crypto')
const { userStatuses } = require('../../data/enums')

module.exports = (sequelize, DataTypes) => {
  const student = sequelize.define(
    'student',
    {
      studentId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      surname: {
        type: DataTypes.STRING,
        allowNull: false
      },
      fullname: {
        type: DataTypes.VIRTUAL,
        get () {
          return `${this.name} ${this.surname}`
        }
      },
      mail: {
        type: DataTypes.STRING
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      department: {
        type: DataTypes.STRING,
        allowNull: false
      },
      grade: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      gpa: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: userStatuses.PASSIVE
      },
      hasVoted: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'no'
      }
    },
    {
      timestamps: false
    }
  )

  student.beforeUpdate(instance => {
    if (instance.password) {
      return hashPassword(instance.password).then(hashedPassword => {
        instance.password = hashedPassword
      })
    }
  })

  student.methods = {
    hashPassword: async password => {
      const hashedPassword = await hashPassword(password)
      return hashedPassword
    },
    comparePassword: async (candidatePassword, hashedPassword) => {
      const isMatch = await comparePassword(candidatePassword, hashedPassword)
      return isMatch
    }
  }

  return student
}
