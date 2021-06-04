module.exports = function (sequelize, DataTypes) {
  const studentToken = sequelize.define(
    'studentToken',
    {
      studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'student_id'
      },
      token: { type: DataTypes.STRING, allowNull: false }
    },
    {
      updatedAt: false
    }
  )

  studentToken.associate = function (models) {
    studentToken.belongsTo(models.student, {
      foreignKey: 'studentId'
    })
  }

  return studentToken
}
