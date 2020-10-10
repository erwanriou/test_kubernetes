const Errors = require("../factory/errors")
const { CustomError } = Errors

module.exports = (err, req, res, next) => {
  if (err instanceof CustomError) {
    res.status(err.statusCode).send({ errors: err.serializeErrors() })
  } else {
    // CASE ERROR IS NOT HANDLED
    res
      .status(500)
      .send({ errors: [{ message: `Something when wrong: ${err}` }] })
  }
  next()
}
