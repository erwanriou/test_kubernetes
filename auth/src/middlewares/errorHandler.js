const Errors = require("../factory/errors")
const { RequestValdationError, DatabaseConnectionError } = Errors

module.exports = (err, req, res, next) => {
  if (err instanceof RequestValdationError) {
    console.log("handling as request validation error")
  }
  if (err instanceof DatabaseConnectionError) {
    console.log("handling this error as db connection error")
  }
  res.status(400).send({
    message: err.message
  })

  return next()
}
