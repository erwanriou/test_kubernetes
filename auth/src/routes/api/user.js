const express = require("express")

// IMPORT MIDDLEWARE
const importCommon = require("@erwanriou/ticket-shop-common")
const isCurrentUser = importCommon("middlewares", "isCurrentUser")

// DECLARE ROUTER
const router = express.Router()

// @route  GET api/users/user
// @desc   Fetch information about currently logged user
// @access Public
router.get("/", isCurrentUser, (req, res) => {
  res.send({ user: req.user || null })
})

module.exports = router
