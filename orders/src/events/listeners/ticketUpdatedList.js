const { Listener } = importCommon("factory", "listener")
const { Subject, QueueGroupName } = importCommon("factory", "types")

// IMPORT MODELS
const Ticket = require("../../models/Ticket")

// CHILDREN CLASS
class TicketUpdatedList extends Listener {
  subject = Subject.TICKET_UPDATED
  queueGroupName = QueueGroupName.ORDER_SERVICE

  async onMessage(data, msg) {
    const { title, price, id } = data
    const ticket = await Ticket.findById(id)

    if (!ticket) {
      throw new Error("Ticket not found")
    }

    const ticketContent = {
      title,
      price
    }

    await Ticket.findOneAndUpdate(
      { _id: id },
      { $set: ticketContent },
      { new: true }
    )
    msg.ack()
  }
}

exports.TicketUpdatedList = TicketUpdatedList
