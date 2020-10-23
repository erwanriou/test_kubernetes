const express = require("express")
const db = require("mongoose")

// IMPORT MIDDLWARES
const importCommon = require("@erwanriou/ticket-shop-common")
const isLogged = importCommon("middlewares", "isLogged")

// IMPORT MODEL
const Order = require("../../models/Order")
const Ticket = require("../../models/Ticket")

// IMPORT EVENTS
const { NatsWrapper } = importCommon("services", "eventbus")
// const { OrderCreatedPub } = require("../../events/publishers/orderCreatedPub")
// const { OrderUpdatedPub } = require("../../events/publishers/orderUpdatedPub")

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

const EXPIRATION_WINDOW_SECONDS = 15 * 60

// @route  GET api/orders
// @desc   Get all orders
// @access Public
router.get("/", isLogged, async (req, res) => {
  const orders = await Order.find({ userId: req.user.id }).populate("_ticket")

  res.send(orders)
})

// @route  POST api/orders
// @desc   Create a ticket
// @access Private
router.post(
  "/",
  isLogged,
  [
    validator
      .body("ticketId")
      .not()
      .isEmpty()
      .withMessage("TicketId is required")
  ],
  validateRequest,
  async (req, res) => {
    const { ticketId } = req.body
    const _ticket = await Ticket.findById(ticketId)
    // ENSURE TICKET EXIST IN DATABASE OR IS NOT RESERVED
    if (!_ticket) {
      throw new NotFoundError()
    }
    // ENSURE TICKET IS NOT RESERVED
    const isReserved = await _ticket.isReserved()
    if (isReserved) {
      throw new BadRequestError("Ticket is already reserved")
    }
    // DEFINE EXPIRATION TIME
    const expiration = new Date()
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS)

    // CREATE NEW ORDER
    const order = new Order({
      userId: req.user.id,
      status: "CREATED",
      expiresAt: expiration,
      _ticket
    })

    // HANDLE MONGODB TRANSACTIONS
    const SESSION = await db.startSession()
    await SESSION.startTransaction()
    // TRANSACTION
    try {
      await order.save()
      // PREVENT TEST ISSUES
      // if (process.env.NODE_ENV !== "test") {
      //   await new OrderCreatedPub(NatsWrapper.client()).publish({
      //     id: order.id,
      //     title: order.title,
      //     price: order.price,
      //     userId: order.userId
      //   })
      // }
      await SESSION.commitTransaction()
      res.status(201).send(order)
    } catch (err) {
      // CATCH ANY ERROR DUE TO TRANSACTION
      await SESSION.abortTransaction()
      throw new DatabaseConnectionError()
    } finally {
      // FINALIZE SESSION
      SESSION.endSession()
    }
  }
)

module.exports = router
