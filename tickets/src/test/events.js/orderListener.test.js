const mongoose = require("mongoose")
const faker = require("faker")
const { NatsWrapper } = require("../../services/natsWrapper")
const { OrderCreatedList } = require("../../events/listeners/orderCreatedList")
const { OrderCancelList } = require("../../events/listeners/orderCancelList")
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

// SETUP FUNCTION TO MOCK LISTENER
const cancelListenerSetup = async () => {
  const listener = new OrderCancelList(NatsWrapper.client)
  const orderId = new mongoose.Types.ObjectId().toHexString()
  const ticket = new Ticket({
    title: faker.commerce.productName(),
    price: faker.finance.amount(),
    userId: new mongoose.Types.ObjectId().toHexString()
  })

  await ticket.set({ orderId })
  await ticket.save()

  const data = {
    __v: 0,
    id: orderId,
    status: "CREATED",
    ticket: {
      id: ticket.id
    }
  }

  const msg = {
    ack: jest.fn()
  }
  return { listener, data, ticket, orderId, msg }
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

it("update the ticket, publish and ack message", async () => {
  const { listener, data, ticket, orderId, msg } = await cancelListenerSetup()
  await listener.onMessage(data, msg)

  const updatedTicket = await Ticket.findById(ticket.id)
  expect(updatedTicket.orderId).toEqual(undefined)
  expect(msg.ack).toHaveBeenCalled()
})
