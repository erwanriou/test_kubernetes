const importCommon = require("@erwanriou/ticket-shop-common")
const { Publisher } = importCommon("factory", "publisher")
const { Subject, QueueGroupName } = importCommon("factory", "types")

// CHILDREN CLASS
class PaymentCreatedPub extends Publisher {
  subject = Subject.PAYMENT_CREATED
}

exports.PaymentCreatedPub = PaymentCreatedPub
