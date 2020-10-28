const importCommon = require("@erwanriou/ticket-shop-common")
const { Publisher } = importCommon("factory", "publisher")
const { Subject, QueueGroupName } = importCommon("factory", "types")

// CHILDREN CLASS
class OrderCreatedPub extends Publisher {
  subject = Subject.ORDER_CREATED
}

exports.OrderCreatedPub = OrderCreatedPub
