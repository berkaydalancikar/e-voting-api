class ApiError extends Error {
  constructor (error) {
    super(error.message)
    this.name = 'ApiError'
    this.key = error.name
    Error.captureStackTrace(this, this.constructor)
    this.status = 200
  }
}

module.exports = ApiError
