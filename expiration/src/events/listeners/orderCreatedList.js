const importCommon = require("@erwanriou/ticket-shop-common")
const { Listener } = importCommon("factory", "listener")
const { Subject, QueueGroupName } = importCommon("factory", "types")

const { NatsWrapper } = require("../../services/natsWrapper")
const { expirationQueue } = require("../../queues/expirationQueue")

// IMPORT MODELS
// const Ticket = require("../../models/Ticket")

// CHILDREN CLASS
class OrderCreatedList extends Listener {
  subject = Subject.ORDER_CREATED
  queueGroupName = QueueGroupName.EXPIRATION_SERVICE

  async onMessage(data, msg) {
    await expirationQueue.add({
      orderId: data.id
    })
    msg.ack()
  }
}

exports.OrderCreatedList = OrderCreatedList
