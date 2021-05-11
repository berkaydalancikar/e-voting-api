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
      mail: {
        type: DataTypes.STRING,
        defaultValue: 'this.studentId' + '@stu.iku.edu.tr'
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      primaryDepartment: {
        type: DataTypes.STRING,
        allowNull: false
      },
      secondaryDepartment: {
        type: DataTypes.STRING,
        allowNull: true
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
        defaultValue: 'passive'
      },
      hasVoted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      isCandidate: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    },
    {
      timestamps: false,
      paranoid: true
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
