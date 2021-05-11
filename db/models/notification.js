module.exports = (sequelize, DataTypes) => {
  const notification = sequelize.define(
    'notification',
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      content: {
        type: DataTypes.STRING,
        allowNull: false
      },
      department: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      paranoid: true,
      timestamps: false
    }
  )
  return notification
}
