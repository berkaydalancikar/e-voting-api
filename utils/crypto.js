const bcrypt = require('bcrypt')
const { v4: uuidv4 } = require('uuid')

const hashPassword = async password => {
  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password, salt)
  return hash
}

const comparePassword = async (candidatePassword, hashedPassword) => {
  const isMatch = await bcrypt.compare(candidatePassword, hashedPassword)
  return isMatch
}

const generateGuid = () => {
  return uuidv4()
}

module.exports = {
  hashPassword,
  comparePassword,
  generateGuid
}
