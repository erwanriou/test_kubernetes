const importCommon = require("@erwanriou/ticket-shop-common")
const { Publisher } = importCommon("factory", "publisher")
const { Subject, QueueGroupName } = importCommon("factory", "types")

// CHILDREN CLASS
class ExpirationCompletedPub extends Publisher {
  subject = Subject.EXPIRATION_COMPLETED
}

exports.ExpirationCompletedPub = ExpirationCompletedPub
