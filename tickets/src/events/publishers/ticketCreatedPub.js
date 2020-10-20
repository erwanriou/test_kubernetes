const { Publisher } = importCommon("factory", "publisher")
const { Subject, QueueGroupName } = importCommon("factory", "types")

// CHILDREN CLASS
class TicketCreatedPub extends Publisher {
  subject = Subject.TICKET_CREATED
}

exports.TicketCreatedPub = TicketCreatedPub
