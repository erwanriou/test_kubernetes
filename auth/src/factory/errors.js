const validator = require("express-validator")

class RequestValdationError extends Error {
  constructor(errors) {
    super()
    this.errors = errors
    Object.setPrototypeOf(this, RequestValdationError.prototype)
  }
}

class DatabaseConnectionError extends Error {
  reason = "Error connecting to database"

  constructor(errors) {
    super()
    this.errors = errors
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype)
  }
}

exports.RequestValdationError = RequestValdationError
exports.DatabaseConnectionError = DatabaseConnectionError
