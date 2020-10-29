const mongoose = require("mongoose")
const faker = require("faker")
const { NatsWrapper } = require("../../services/natsWrapper")
const {
  ExpirationCompletedList
} = require("../../events/listeners/expirationCompletedList")
const Order = require("../../models/Order")
const Ticket = require("../../models/Ticket")

// SETUP FUNCTION TO MOCK LISTENER
const completedListenerSetup = async () => {
  const listener = new ExpirationCompletedList(NatsWrapper.client)

  const ticket = new Ticket({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: faker.commerce.productName(),
    price: faker.finance.amount()
  })
  await ticket.save()

  const order = new Order({
    userId: new mongoose.Types.ObjectId().toHexString(),
    expiresAt: new Date(),
    status: "CREATED",
    _ticket: ticket.id
  })
  await order.save()

  const data = {
    orderId: order.id
  }

  const msg = {
    ack: jest.fn()
  }
  return { listener, order, ticket, data, msg }
}

it("update the order status to cancelled", async () => {
  const { listener, data, msg } = await completedListenerSetup()
  await listener.onMessage(data, msg)

  const updatedOrder = await Order.findById(data.orderId)

  expect(updatedOrder.status).toEqual("CANCELLED")
})

it("ack the message", async () => {
  const { listener, data, msg } = await completedListenerSetup()
  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})
