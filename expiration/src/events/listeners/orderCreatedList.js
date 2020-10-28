const importCommon = require("@erwanriou/ticket-shop-common")
const { Listener } = importCommon("factory", "listener")
const { Subject, QueueGroupName } = importCommon("factory", "types")

const { NatsWrapper } = require("../../services/natsWrapper")
const { expirationQueue } = require("../../queues/expirationQueue")

// CHILDREN CLASS
class OrderCreatedList extends Listener {
  subject = Subject.ORDER_CREATED
  queueGroupName = QueueGroupName.EXPIRATION_SERVICE

  async onMessage(data, msg) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime()
    await expirationQueue.add(
      {
        orderId: data.id
      },
      {
        delay
      }
    )
    msg.ack()
  }
}

exports.OrderCreatedList = OrderCreatedList
