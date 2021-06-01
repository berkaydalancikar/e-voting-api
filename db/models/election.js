const { electionProgress } = require('../../data/enums')

module.exports = (sequelize, DataTypes) => {
  const election = sequelize.define(
    'election',
    {
      department: {
        type: DataTypes.STRING,
        allowNull: false
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: electionProgress.IDLE
      }
    },
    {
      timestamps: false
    }
  )

  return election
}
