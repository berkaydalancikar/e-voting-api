module.exports = function (sequelize, DataTypes) {
  const resetPasswordToken = sequelize.define(
    'resetPasswordToken',
    {
      studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'user_id'
      },
      token: { type: DataTypes.STRING, allowNull: false }
    },
    {
      timestamps: false
    }
  )

  resetPasswordToken.associate = function (models) {
    resetPasswordToken.belongsTo(models.student, {
      foreignKey: 'studentId'
    })
  }

  return resetPasswordToken
}
