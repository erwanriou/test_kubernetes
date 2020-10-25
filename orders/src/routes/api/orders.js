const express = require("express")
const db = require("mongoose")

// IMPORT MIDDLWARES
const importCommon = require("@erwanriou/ticket-shop-common")
const isLogged = importCommon("middlewares", "isLogged")

// IMPORT MODEL
const Order = require("../../models/Order")
const Ticket = require("../../models/Ticket")

// IMPORT EVENTS
const { NatsWrapper } = require("../../services/natsWrapper")
const { OrderCreatedPub } = require("../../events/publishers/orderCreatedPub")
const {
  OrderCancelledPub
} = require("../../events/publishers/orderCancelledPub")

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
// @desc   Get all orders for a specific user
// @access Private
router.get("/", isLogged, async (req, res) => {
  const orders = await Order.find({ userId: req.user.id }).populate("_ticket")

  res.send(orders)
})

// @route  GET api/orders/:id
// @desc   Get one specific order for a specific user
// @access Private
router.get("/:id", isLogged, async (req, res) => {
  const { id } = req.params

  const order = await Order.findById(id).populate("_ticket")

  if (!order) {
    throw new NotFoundError()
  }
  if (order.userId !== req.user.id) {
    throw new NotAuthorizedError()
  }

  res.send(order)
})

// @route  DELETE api/orders/:id
// @desc   Delete, or cancel one specific order for a specific user
// @access Private
router.delete("/:id", isLogged, async (req, res) => {
  const { id } = req.params

  let order = await Order.findById(id)

  if (!order) {
    throw new NotFoundError()
  }
  if (order.userId !== req.user.id) {
    throw new NotAuthorizedError()
  }

  // HANDLE MONGODB TRANSACTIONS
  const SESSION = await db.startSession()
  await SESSION.startTransaction()
  // TRANSACTION
  try {
    order = await Order.findOneAndUpdate(
      { _id: id },
      { $set: { status: "CANCELLED" } },
      { new: true }
    )

    // PREVENT TEST ISSUES
    if (process.env.NODE_ENV !== "test") {
      await new OrderCancelledPub(NatsWrapper.client()).publish({
        id: order.id,
        ticket: { id: order._ticket }
      })
    }
    await SESSION.commitTransaction()
    res.status(204).send(order)
  } catch (err) {
    // CATCH ANY ERROR DUE TO TRANSACTION
    await SESSION.abortTransaction()
    throw new DatabaseConnectionError()
  } finally {
    // FINALIZE SESSION
    SESSION.endSession()
  }
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
      if (process.env.NODE_ENV !== "test") {
        await new OrderCreatedPub(NatsWrapper.client()).publish({
          id: order.id,
          status: order.status,
          userId: order.userId,
          expiresAt: order.expiresAt.toISOString(),
          ticket: { id: _ticket.id, price: _ticket.price }
        })
      }
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
