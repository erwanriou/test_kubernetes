const mongoose = require("mongoose")
const faker = require("faker")
const { NatsWrapper } = require("../../services/natsWrapper")
const {
  TicketCreatedList
} = require("../../events/listeners/ticketCreatedList")

const setup = async () => {
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

it("Create and save a ticket", async () => {
  const { listener, data, msg } = await setup()
  console.log(listener, data)
  await listener.onMessage(data, msg)
})

it("acks the message", async () => {})
