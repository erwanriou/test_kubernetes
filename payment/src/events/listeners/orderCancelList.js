const importCommon = require("@erwanriou/ticket-shop-common")
const { Listener } = importCommon("factory", "listener")
const { Subject, QueueGroupName } = importCommon("factory", "types")

// IMPORT MODELS
const Order = require("../../models/Order")

// CHILDREN CLASS
class OrderCancelList extends Listener {
  subject = Subject.ORDER_CANCELLED
  queueGroupName = QueueGroupName.PAYMENT_SERVICE

  async onMessage(data, msg) {
    const order = await Order.findById(data.id)

    if (!order) {
      throw new Error("Order not found")
    }

    order.set({ orderId: undefined })
    await order.save()

    msg.ack()
  }
}

exports.OrderCancelList = OrderCancelList
