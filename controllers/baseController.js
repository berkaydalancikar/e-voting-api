const db = require('../db')
const { Op, Sequelize } = require('sequelize')
const nodeUtil = require('util')
const ApiError = require('../models/ApiError')

const getOrderQuery = (sort, order, defaultQuery = [['id', 'DESC']]) => {
  if (!sort) {
    return defaultQuery
  }

  const sortProps = sort.split('.')
  const length = sortProps.length
  const orderQuery = [[]]

  sortProps.forEach((prop, index) => {
    if (index === length - 1) {
      orderQuery[0].push(prop, order)
    } else if (prop.includes('|')) {
      const propDetails = prop.split('|')
      const modelName = propDetails[0]
      const as = propDetails[1]
      orderQuery[0].push({ model: db[modelName], as })
    } else {
      orderQuery[0].push(db[prop])
    }
  })

  return orderQuery
}

module.exports = {
  db,
  Op,
  Sequelize,
  ApiError,
  nodeUtil,
  getOrderQuery
}
