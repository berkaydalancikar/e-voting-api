const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const basename = path.basename(__filename)
const config = require('config')
const db = {}

const dbConfig = config.get('db.config')
const dbUrl =
  process.env.DATABASE_URL || config.has('db.url') ? config.get('db.url') : null

let sequelize
if (dbUrl) {
  sequelize = new Sequelize(dbUrl, { ...dbConfig })
} else {
  sequelize = new Sequelize(dbConfig)
}

fs.readdirSync(path.join(__dirname, 'models'))
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('index')
    )
  })
  .forEach(file => {
    const model = require(path.join(__dirname, 'models', file))(
      sequelize,
      Sequelize.DataTypes
    )
    db[model.name] = model
  })

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize

module.exports = db
