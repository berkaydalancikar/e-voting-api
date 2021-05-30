const { hashPassword, comparePassword } = require('../../utils/crypto')

module.exports = (sequelize, DataTypes) => {
  const admin = sequelize.define(
    'admin',
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false
      },
      department: {
        type: DataTypes.STRING,
        allowNull: false
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: 'passive'
      }
    },
    {
      timestamps: false
    }
  )

  admin.beforeUpdate(instance => {
    if (instance.password) {
      return hashPassword(instance.password).then(hashedPassword => {
        instance.password = hashedPassword
      })
    }
  })

  admin.methods = {
    hashPassword: async password => {
      const hashedPassword = await hashPassword(password)
      return hashedPassword
    },
    comparePassword: async (candidatePassword, hashedPassword) => {
      const isMatch = await comparePassword(candidatePassword, hashedPassword)
      return isMatch
    }
  }

  return admin
}
