module.exports = (sequelize, DataTypes) => {
  const candidate = sequelize.define(
    'candidate',
    {
      studentId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      department: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false
      },
      votes: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      }
    },
    {
      timestamps: false
    }
  )

  candidate.associate = function (models) {
    candidate.belongsTo(models.student, {
      foreignKey: 'studentId'
    })
  }

  return candidate
}
