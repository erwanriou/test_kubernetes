const express = require("express")
const jwt = require("jsonwebtoken")

// DECLARE ROUTER
const router = express.Router()

// @route  GET api/users/user
// @desc   Fetch information about currently logged user
// @access Public
router.get("/", (req, res) => {
  if (!req.session || !req.session.jwt) {
    return res.send({ currentUser: null })
  }
  try {
    const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY)
    return res.send({ currentUser: payload })
  } catch (err) {
    res.send({ currentUser: null })
  }
})

module.exports = router
