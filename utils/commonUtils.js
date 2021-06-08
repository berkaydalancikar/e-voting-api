const isBefore = require('date-fns/isBefore')
const addSeconds = require('date-fns/addSeconds')

const isExpired = (date, expiryInSeconds) => {
  return isBefore(addSeconds(date, expiryInSeconds), Date.now())
}

module.exports = {
  isExpired
}
