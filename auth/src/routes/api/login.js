const express = require("express")

// IMPORT MODELS
const User = require("../../models/User")

// ERROR VALIDATIONS
const validator = require("express-validator")
const Errors = require("../../factory/errors")
const { RequestValdationError } = Errors

// DECLARE ROUTER
const router = express.Router()

router.post(
  "/",
  [
    validator.body("email").isEmail().withMessage("Email must be valid"),
    validator
      .body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters")
  ],
  async (req, res) => {
    const errors = validator.validationResult(req)
    if (!errors.isEmpty()) {
      throw new RequestValdationError(errors.array())
    }
    const { email, password } = req.body
    const existingUser = await User.findOne({ email })

    if (existingUser) {
      console.log("Email in use")
      return res.send({})
    }
  }
)

module.exports = router
