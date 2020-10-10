const jwt = require("jsonwebtoken")
const Errors = require("../factory/errors")
const { NotAuthorizedError } = Errors

module.exports = (req, res, next) => {
  if (!req.user) {
    throw new NotAuthorizedError()
  }
  next()
}
