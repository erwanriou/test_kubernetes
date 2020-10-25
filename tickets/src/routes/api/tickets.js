const express = require("express")
const db = require("mongoose")

// IMPORT MIDDLWARES
const importCommon = require("@erwanriou/ticket-shop-common")
const isLogged = importCommon("middlewares", "isLogged")

// IMPORT MODEL
const Ticket = require("../../models/Ticket")

// IMPORT EVENTS
const { NatsWrapper } = require("../../services/natsWrapper")
const { TicketCreatedPub } = require("../../events/publishers/ticketCreatedPub")
const { TicketUpdatedPub } = require("../../events/publishers/ticketUpdatedPub")

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

    // CREATE TICKET
    const ticket = new Ticket({
      userId: req.user.id,
      title,
      price
    })

    // HANDLE MONGODB TRANSACTIONS
    const SESSION = await db.startSession()
    await SESSION.startTransaction()
    // TRANSACTION
    try {
      await ticket.save()
      // PREVENT TEST ISSUES
      if (process.env.NODE_ENV !== "test") {
        await new TicketCreatedPub(NatsWrapper.client()).publish({
          id: ticket.id,
          title: ticket.title,
          price: ticket.price,
          userId: ticket.userId
        })
      }
      await SESSION.commitTransaction()
      res.status(201).send(ticket)
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

// @route  GET api/tickets
// @desc   Get all tickets
// @access Public
router.get("/", async (req, res) => {
  const tickets = await Ticket.find({})

  res.send(tickets)
})

// @route  GET api/tickets/:id
// @desc   Get a ticket by id
// @access Public
router.get("/:id", async (req, res) => {
  const { id } = req.params
  const ticket = await Ticket.findById(id)

  if (!ticket) {
    throw new NotFoundError()
  }
  res.status(200).send(ticket)
})

// @route  GET api/tickets
// @desc   Get all tickets
// @access Public
router.put(
  "/:id",
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
    const { id } = req.params

    let ticket = await Ticket.findById(id)

    if (!ticket) {
      throw new NotFoundError()
    }

    if (ticket.userId !== req.user.id) {
      throw new NotAuthorizedError()
    }
    const ticketContent = { title, price }

    // HANDLE MONGODB TRANSACTIONS
    const SESSION = await db.startSession()
    await SESSION.startTransaction()
    // TRANSACTION
    try {
      ticket = await Ticket.findOneAndUpdate(
        { _id: id },
        { $set: ticketContent },
        { new: true }
      )
      // PREVENT TEST ISSUES
      if (process.env.NODE_ENV !== "test") {
        await new TicketUpdatedPub(NatsWrapper.client()).publish({
          id: ticket.id,
          title: ticket.title,
          price: ticket.price,
          userId: ticket.userId
        })
      }
      await SESSION.commitTransaction()
      res.status(200).send(ticket)
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
