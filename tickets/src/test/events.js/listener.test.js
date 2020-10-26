const mongoose = require("mongoose")
const faker = require("faker")
const { NatsWrapper } = require("../../services/natsWrapper")
const { OrderCreatedList } = require("../../events/listeners/orderCreatedList")
const Ticket = require("../../models/Ticket")

// SETUP FUNCTION TO MOCK LISTENER
const createdListenerSetup = async () => {
  const listener = new OrderCreatedList(NatsWrapper.client)

  const ticket = new Ticket({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: faker.commerce.productName(),
    price: faker.finance.amount(),
    userId: new mongoose.Types.ObjectId().toHexString()
  })

  await ticket.save()

  const data = {
    __v: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    status: "CREATED",
    userId: new mongoose.Types.ObjectId().toHexString(),
    expireAt: Date.now(),
    ticket: {
      id: ticket.id,
      price: ticket.price
    }
  }

  const msg = {
    ack: jest.fn()
  }
  return { listener, data, ticket, msg }
}

it("Add an order id to the ticket reserved", async () => {
  const { listener, data, ticket, msg } = await createdListenerSetup()
  await listener.onMessage(data, msg)

  const updatedTicket = await Ticket.findById(ticket.id)
  expect(updatedTicket.orderId).toEqual(data.id)
})

it("acks the message when created", async () => {
  const { listener, data, ticket, msg } = await createdListenerSetup()
  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})
