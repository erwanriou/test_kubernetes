const { Publisher } = importCommon("factory", "publisher")
const { Subject, QueueGroupName } = importCommon("factory", "types")

// CHILDREN CLASS
class OrderCancelledPub extends Publisher {
  subject = Subject.ORDER_CANCELLED
}

exports.OrderCancelledPub = OrderCancelledPub
