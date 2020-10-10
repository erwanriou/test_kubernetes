const express = require("express")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

// IMPORT MODELS
const User = require("../../models/User")

// ERROR VALIDATIONS
const validator = require("express-validator")
const validateRequest = require("../../middlewares/validateRequest")
const Errors = require("../../factory/errors")
const { BadRequestError } = Errors

// DECLARE ROUTER
const router = express.Router()

router.post(
  "/",
  [
    validator.body("email").isEmail().withMessage("Email must be valid"),
    validator
      .body("password")
      .trim()
      .notEmpty()
      .withMessage("You must supply a password")
  ],
  validateRequest,
  async (req, res) => {
    const { email, password } = req.body
    const existingUser = await User.findOne({ email })

    if (!existingUser) {
      throw new BadRequestError("Invalid credentials")
    }

    // CHECK PASSWORD
    const match = await bcrypt.compareSync(password, existingUser.passwordHash)

    if (match) {
      // GENERATE JWT
      const payload = {
        id: existingUser.id,
        email: existingUser.email
      }

      // STORE JWT
      req.session = { jwt: jwt.sign(payload, process.env.JWT_KEY) }

      res.status(200).send(existingUser)
    } else {
      throw new BadRequestError("Incorrect password")
    }
  }
)

module.exports = router
