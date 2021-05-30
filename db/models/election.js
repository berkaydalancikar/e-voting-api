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
        defaultValue: 'passive'
      }
    },
    {
      timestamps: false
    }
  )

  return election
}
