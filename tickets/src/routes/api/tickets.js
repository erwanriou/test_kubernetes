const express = require("express")

// IMPORT MIDDLWARES
const importCommon = require("@erwanriou/ticket-shop-common")
const isLogged = importCommon("middlewares", "isLogged")

// IMPORT MODEL
const Ticket = require("../../models/Ticket")

// IMPORT EVENTS
const { NatsWrapper } = require("../../services/eventbus")
const { TicketCreatedPub } = require("../../events/publishers/ticketCreatedPub")

//ERRORS VALIDATION
const validateRequest = importCommon("middlewares", "validateRequest")
const { NotFoundError, NotAuthorizedError } = importCommon("factory", "errors")
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
    await new TicketCreatedPub(NatsWrapper.client()).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId
    })
    res.status(201).send(ticket)
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

    const ticket = await Ticket.findById(id)

    if (!ticket) {
      throw new NotFoundError()
    }

    if (ticket.userId !== req.user.id) {
      throw new NotAuthorizedError()
    }

    await Ticket.findOneAndUpdate(
      { id },
      {
        $set: {
          title,
          price
        },
        new: true
      }
    )
    res.send(ticket)
  }
)

module.exports = router
