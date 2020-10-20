const { Publisher } = importCommon("factory", "publisher")
const { Subject, QueueGroupName } = importCommon("factory", "types")

// CHILDREN CLASS
class TicketUpdatedPub extends Publisher {
  subject = Subject.TICKET_UPDATED
}

exports.TicketUpdatedPub = TicketUpdatedPub
