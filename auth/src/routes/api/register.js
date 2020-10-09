const express = require("express")

// IMPORT MODELS
const User = require("../../models/User")

// ERROR VALIDATIONS
const validator = require("express-validator")
const Errors = require("../../factory/errors")
const { RequestValdationError, BadRequestError } = Errors

// DECLARE ROUTER
const router = express.Router()

// @route  POST api/users/register
// @desc   Register a user
// @access Public
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

    // CHECK IF USER EXIST
    if (existingUser) {
      throw new BadRequestError("Email in use")
    }

    // CREATING USER
    const newUser = new User({
      email,
      password
    })
    await newUser.save()

    res.status(201).send(newUser)
  }
)

module.exports = router
