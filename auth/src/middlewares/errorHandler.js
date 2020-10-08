const Errors = require("../factory/errors")
const { CustomError } = Errors

module.exports = (err, req, res, next) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() })
  }

  // CASE ERROR IS NOT HANDLED
  res
    .status(503)
    .send({ errors: [{ message: `Something when wrong: ${err}` }] })

  return next()
}
