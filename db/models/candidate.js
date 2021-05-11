module.exports = (sequelize, DataTypes) => {
  const candidate = sequelize.define(
    'candidate',
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
      timestamps: false,
      paranoid: true
    }
  )

  return candidate
}
