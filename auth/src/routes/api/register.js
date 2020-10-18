const express = require("express")
const jwt = require("jsonwebtoken")

// IMPORT MODELS AND LIBRARIES
const importCommon = require("@erwanriou/ticket-shop-common")
const User = require("../../models/User")

// ERROR VALIDATIONS
const validator = require("express-validator")
const validateRequest = importCommon("middlewares", "validateRequest")
const { BadRequestError } = importCommon("factory", "errors")

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
  validateRequest,
  async (req, res) => {
    const { email, password } = req.body
    const existingUser = await User.findOne({ email })

    // CHECK IF USER EXIST
    if (existingUser) {
      throw new BadRequestError("Email in use")
    }

    // CREATING USER
    const user = new User({
      email,
      password
    })
    await user.save()

    // GENERATE JWT
    const payload = {
      id: user.id,
      email: user.email
    }

    // STORE JWT
    req.session = { jwt: jwt.sign(payload, process.env.JWT_KEY) }

    res.status(201).send(user)
  }
)

module.exports = router
