const mongoose = require("mongoose")
const faker = require("faker")
const { NatsWrapper } = require("../../services/natsWrapper")
const {
  TicketCreatedList
} = require("../../events/listeners/ticketCreatedList")
const {
  TicketUpdatedList
} = require("../../events/listeners/ticketUpdatedList")
const Ticket = require("../../models/Ticket")

// SETUP FUNCTION TO MOCK LISTENER
const createdListenerSetup = async () => {
  const listener = new TicketCreatedList(NatsWrapper.client)
  const data = {
    id: new mongoose.Types.ObjectId().toHexString(),
    title: faker.commerce.productName(),
    price: faker.finance.amount(),
    userId: new mongoose.Types.ObjectId().toHexString()
  }

  const msg = {
    ack: jest.fn()
  }
  return { listener, data, msg }
}

const updatedListenerSetup = async () => {
  const listener = new TicketUpdatedList(NatsWrapper.client)

  const ticket = new Ticket({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: faker.commerce.productName(),
    price: faker.finance.amount()
  })

  await ticket.save()

  const data = {
    id: ticket.id,
    __v: ticket.__v + 1,
    title: faker.commerce.productName(),
    price: faker.finance.amount(),
    userId: new mongoose.Types.ObjectId().toHexString()
  }

  const msg = {
    ack: jest.fn()
  }
  return { listener, data, ticket, msg }
}

it("Create and save a ticket", async () => {
  const { listener, data, msg } = await createdListenerSetup()
  await listener.onMessage(data, msg)
  const ticket = await Ticket.findById(data.id)

  expect(ticket).toBeDefined()
  expect(ticket.title).toEqual(data.title)
  expect(ticket.price).toEqual(data.price)
})

it("acks the message when create", async () => {
  const { listener, data, msg } = await createdListenerSetup()
  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})

it("find, update and save a ticket", async () => {
  const { listener, data, ticket, msg } = await updatedListenerSetup()
  await listener.onMessage(data, msg)

  const updatedTicket = await Ticket.findById(ticket.id)
  expect(updatedTicket.title).toEqual(data.title)
  expect(updatedTicket.price).toEqual(data.price)
  expect(updatedTicket.__v).toEqual(data.__v)
})

it("acks the message when update", async () => {
  const { listener, data, ticket, msg } = await updatedListenerSetup()
  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})

it("it doesn't call ack if version is not corresponding", async () => {
  const { listener, data, ticket, msg } = await updatedListenerSetup()

  data.__v = 10

  try {
    await listener.onMessage(data, msg)
  } catch (e) {}

  expect(msg.ack).not.toHaveBeenCalled()
})
