const importCommon = require("@erwanriou/ticket-shop-common")
const { Listener } = importCommon("factory", "listener")
const { Subject, QueueGroupName } = importCommon("factory", "types")
const { TicketUpdatedPub } = require("../publishers/ticketUpdatedPub")
const { NatsWrapper } = require("../../services/natsWrapper")

// IMPORT MODELS
const Order = require("../../models/Order")

// CHILDREN CLASS
class OrderCreatedList extends Listener {
  subject = Subject.ORDER_CREATED
  queueGroupName = QueueGroupName.PAYMENT_SERVICE

  async onMessage(data, msg) {
    const order = new Order({
      id: data.id,
      userId: data.userId,
      price: data.ticket.price,
      status: data.status,
      __v: data.__v
    })

    await order.save()

    msg.ack()
  }
}

exports.OrderCreatedList = OrderCreatedList
