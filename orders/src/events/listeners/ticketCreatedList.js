const { Listener } = importCommon("factory", "listener")
const { Subject, QueueGroupName } = importCommon("factory", "types")

// IMPORT MODELS
const Ticket = require("../../models/Ticket")

// CHILDREN CLASS
class TicketCreatedList extends Listener {
  subject = Subject.TICKET_CREATED
  queueGroupName = QueueGroupName.ORDER_SERVICE

  async onMessage(data, msg) {
    const { title, price, id } = data
    const ticket = new Ticket({
      _id: id,
      title,
      price
    })

    await ticket.save()
    msg.ack()
  }
}

exports.TicketCreatedList = TicketCreatedList
