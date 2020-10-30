const mongoose = require("mongoose")
const faker = require("faker")
const { NatsWrapper } = require("../../services/natsWrapper")
const { OrderCreatedList } = require("../../events/listeners/orderCreatedList")
const { OrderCancelList } = require("../../events/listeners/orderCancelList")
const Order = require("../../models/Order")

// SETUP FUNCTION TO MOCK LISTENER
const createdListenerSetup = async () => {
  const listener = new OrderCreatedList(NatsWrapper.client)

  const data = {
    __v: 0,
    id: mongoose.Types.ObjectId().toHexString(),
    status: "CREATED",
    userId: mongoose.Types.ObjectId().toHexString(),
    expireAt: Date.now(),
    ticket: {
      id: mongoose.Types.ObjectId().toHexString(),
      price: faker.finance.amount()
    }
  }

  const msg = {
    ack: jest.fn()
  }
  return { listener, data, msg }
}

const cancelledListenerSetup = async () => {
  const listener = new OrderCancelList(NatsWrapper.client)

  const order = new Order({
    _id: mongoose.Types.ObjectId().toHexString(),
    __v: 0,
    userId: mongoose.Types.ObjectId().toHexString(),
    price: faker.finance.amount(),
    status: "CREATED"
  })

  await order.save()

  const data = {
    __v: 1,
    id: order.id,
    ticket: {
      id: mongoose.Types.ObjectId().toHexString(),
      price: faker.finance.amount()
    }
  }

  const msg = {
    ack: jest.fn()
  }
  return { listener, order, data, msg }
}

it("replicate the order info", async () => {
  const { listener, data, msg } = await createdListenerSetup()
  await listener.onMessage(data, msg)

  const order = await Order.findById(data.id)
  expect(order.price).toEqual(data.ticket.price)
})

it("acks the message when created", async () => {
  const { listener, data, msg } = await createdListenerSetup()
  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})

it("Update the status to the order to cancel", async () => {
  const { listener, data, order, msg } = await cancelledListenerSetup()
  await listener.onMessage(data, msg)

  const updatedOrder = await Order.findById(order.id)
  expect(updatedOrder.status).toEqual("CANCELLED")
})

it("acks the message when cancelled", async () => {
  const { listener, data, order, msg } = await cancelledListenerSetup()
  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})
