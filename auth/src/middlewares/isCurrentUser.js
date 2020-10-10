const jwt = require("jsonwebtoken")

module.exports = (req, res, next) => {
  if (!req.session || !req.session.jwt) {
    return next()
  }
  try {
    const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY)
    req.user = payload
  } catch (e) {
    return next()
  }

  next()
}
