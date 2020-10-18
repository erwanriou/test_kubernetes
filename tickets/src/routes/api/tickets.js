const express = require("express")

// IMPORT MIDDLWARES
const importCommon = require("@erwanriou/ticket-shop-common")
const isLogged = importCommon("middlewares", "isLogged")

// IMPORT MODEL
const Ticket = require("../../models/Ticket")

//ERRORS VALIDATION
const validateRequest = importCommon("middlewares", "validateRequest")
const validator = require("express-validator")

// DECLARE ROUTER
const router = express.Router()

// @route  POST api/tickets
// @desc   Create a ticket
// @access Private
router.post(
  "/",
  isLogged,
  [
    validator.body("title").not().isEmpty().withMessage("Title is required"),
    validator
      .body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0")
  ],
  validateRequest,
  async (req, res) => {
    const { title, price } = req.body

    const ticket = new Ticket({
      userId: req.user.id,
      title,
      price
    })

    await ticket.save()

    res.status(201).send(ticket)
  }
)

module.exports = router
