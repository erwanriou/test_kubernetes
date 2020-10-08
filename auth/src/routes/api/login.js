const express = require("express")
const validator = require("express-validator")
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
  (req, res) => {
    const errors = validator.validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).send(errors.array())
    }
    const { email, password } = req.body
    console.log("Creating a user")
    res.send("test")
  }
)

module.exports = router
