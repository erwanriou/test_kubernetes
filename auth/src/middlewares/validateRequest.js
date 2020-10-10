const validator = require("express-validator")
const Errors = require("../factory/errors")
const { RequestValdationError } = Errors

module.exports = (req, res, next) => {
  const errors = validator.validationResult(req)
  if (!errors.isEmpty()) {
    throw new RequestValdationError(errors.array())
  }
  next()
}
