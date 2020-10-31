const express = require("express")
const db = require("mongoose")

// IMPORT MIDDLWARES
const importCommon = require("@erwanriou/ticket-shop-common")
const isLogged = importCommon("middlewares", "isLogged")
const { Stripe } = require("../../services/stripe")

// IMPORT MODEL
const Order = require("../../models/Order")
const Payment = require("../../models/Payment")

//ERRORS VALIDATION
const validator = require("express-validator")
const validateRequest = importCommon("middlewares", "validateRequest")
const {
  NotFoundError,
  BadRequestError,
  NotAuthorizedError,
  DatabaseConnectionError
} = importCommon("factory", "errors")

// DECLARE ROUTER
const router = express.Router()

// @route  POST api/payments
// @desc   Create a new charge payment
// @access Private
router.post(
  "/",
  isLogged,
  [
    validator.body("token").not().isEmpty(),
    validator.body("orderId").not().isEmpty()
  ],
  validateRequest,
  async (req, res) => {
    const { token, orderId } = req.body
    const order = await Order.findById(orderId)
    // SECURITY CHECKS
    if (!order) {
      throw new NotFoundError()
    }

    if (order.userId !== req.user.id) {
      throw new NotAuthorizedError()
    }

    if (order.status === "CANCELLED") {
      throw new BadRequestError("Status of the order have been cancelled.")
    }

    const charge = await Stripe.charges.create({
      currency: "eur",
      amount: order.price * 100,
      source: token
    })

    const payment = new Payment({
      orderId,
      stripeId: charge.id
    })

    await payment.save()

    res.status(201).send({ success: true })
  }
)

module.exports = router
