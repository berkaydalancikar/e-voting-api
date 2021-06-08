const util = require('util')
const config = require('config')
const storageUrl = config.get('storage.url')
const { STUDENT_IMPORT_FOLDER } = require('../../data/storageFolders')

module.exports = (sequelize, DataTypes) => {
  const studentImport = sequelize.define(
    'studentImport',
    {
      fileName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      fileUrl: {
        type: DataTypes.VIRTUAL,
        get () {
          const folderName = util.format(STUDENT_IMPORT_FOLDER, this.contractId)
          return `${storageUrl}/${folderName}/${this.fileName}`
        }
      }
    },
    { updatedAt: false }
  )

  return studentImport
}
