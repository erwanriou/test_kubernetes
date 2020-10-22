const express = require("express")
const db = require("mongoose")

// IMPORT MIDDLWARES
const importCommon = require("@erwanriou/ticket-shop-common")
const isLogged = importCommon("middlewares", "isLogged")

// IMPORT MODEL
// const Orders = require("../../models/Orders")

// IMPORT EVENTS
const { NatsWrapper } = importCommon("services", "eventbus")
// const { TicketCreatedPub } = require("../../events/publishers/ticketCreatedPub")
// const { TicketUpdatedPub } = require("../../events/publishers/ticketUpdatedPub")

//ERRORS VALIDATION
const validator = require("express-validator")
const validateRequest = importCommon("middlewares", "validateRequest")
const {
  NotFoundError,
  NotAuthorizedError,
  DatabaseConnectionError
} = importCommon("factory", "errors")

// DECLARE ROUTER
const router = express.Router()

// @route  GET api/tickets
// @desc   Get all tickets
// @access Public
router.get("/", async (req, res) => {
  const orders = await Orders.find({})

  res.send(orders)
})

// @route  POST api/tickets
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
    const { title, price } = req.body

    // CREATE TICKET
    const order = new Ticket({
      userId: req.user.id,
      title,
      price
    })

    // HANDLE MONGODB TRANSACTIONS
    const SESSION = await db.startSession()
    await SESSION.startTransaction()
    // TRANSACTION
    try {
      await order.save()
      // PREVENT TEST ISSUES
      if (process.env.NODE_ENV !== "test") {
        await new TicketCreatedPub(NatsWrapper.client()).publish({
          id: order.id,
          title: order.title,
          price: order.price,
          userId: order.userId
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
