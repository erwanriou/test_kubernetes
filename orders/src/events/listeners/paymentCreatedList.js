const importCommon = require("@erwanriou/ticket-shop-common")
const { Listener } = importCommon("factory", "listener")
const { Subject, QueueGroupName } = importCommon("factory", "types")

// IMPORT MODELS
const Order = require("../../models/Order")

// CHILDREN CLASS
class PaymentCreatedList extends Listener {
  subject = Subject.PAYMENT_CREATED
  queueGroupName = QueueGroupName.ORDER_SERVICE

  async onMessage(data, msg) {
    const { stripeId, orderId, id } = data
    const order = await Order.findById(orderId)

    if (!order) {
      throw new Error("order not found")
    }

    await order.set({ status: "COMPLETED" }).save()
    msg.ack()
  }
}

exports.PaymentCreatedList = PaymentCreatedList
