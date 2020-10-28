const importCommon = require("@erwanriou/ticket-shop-common")
const { Listener } = importCommon("factory", "listener")
const { Subject, QueueGroupName } = importCommon("factory", "types")

// IMPORT MODELS
const Ticket = require("../../models/Ticket")

// CHILDREN CLASS
class TicketUpdatedList extends Listener {
  subject = Subject.TICKET_UPDATED
  queueGroupName = QueueGroupName.ORDER_SERVICE

  async onMessage(data, msg) {
    const ticket = await Ticket.findByEvent(data)

    if (!ticket) {
      throw new Error("Ticket not found")
    }

    const ticketContent = {
      title: data.title,
      price: data.price
    }

    await ticket.set(ticketContent).save()
    msg.ack()
  }
}

exports.TicketUpdatedList = TicketUpdatedList
