const importCommon = require("@erwanriou/ticket-shop-common")
const { Listener } = importCommon("factory", "listener")
const { Subject, QueueGroupName } = importCommon("factory", "types")

// PUBLISHER
const { OrderCancelledPub } = require("../publishers/orderCancelledPub")
const { NatsWrapper } = require("../../services/natsWrapper")

// IMPORT MODELS
const Order = require("../../models/Order")

// CHILDREN CLASS
class ExpirationCompletedList extends Listener {
  subject = Subject.EXPIRATION_COMPLETED
  queueGroupName = QueueGroupName.ORDER_SERVICE

  async onMessage(data, msg) {
    const order = await Order.findById(data.orderId)
    if (!order) {
      throw new Error("Order not found")
    }
    if (order.status === "COMPLETED") {
      return msg.ack()
    }

    await order.set({ status: "CANCELLED" }).save()
    if (process.env.NODE_ENV !== "test") {
      await new OrderCancelledPub(NatsWrapper.client()).publish({
        id: order.id,
        __v: order.__v,
        ticket: {
          id: order._ticket
        }
      })
    }
    msg.ack()
  }
}

exports.ExpirationCompletedList = ExpirationCompletedList
