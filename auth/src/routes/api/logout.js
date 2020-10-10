const express = require("express")
const router = express.Router()

// @route  POST api/users/user
// @desc   Logout a user
// @access Public
router.post("/", (req, res) => {
  req.session = null
  res.send({})
})

module.exports = router
