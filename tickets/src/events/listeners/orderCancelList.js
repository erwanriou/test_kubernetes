const { Listener } = importCommon("factory", "listener")
const { Subject, QueueGroupName } = importCommon("factory", "types")
const { TicketUpdatedPub } = require("../publishers/ticketUpdatedPub")
const { NatsWrapper } = require("../../services/natsWrapper")

// IMPORT MODELS
const Ticket = require("../../models/Ticket")

// CHILDREN CLASS
class OrderCancelList extends Listener {
  subject = Subject.ORDER_CANCELLED
  queueGroupName = QueueGroupName.TICKET_SERVICE

  async onMessage(data, msg) {
    const ticket = await Ticket.findById(data.ticket.id)

    if (!ticket) {
      throw new Error("Ticket not found")
    }

    ticket.set({ orderId: undefined })
    await ticket.save()
    if (process.env.NODE_ENV !== "test") {
      await new TicketUpdatedPub(NatsWrapper.client()).publish(ticket)
    }
    msg.ack()
  }
}

exports.OrderCancelList = OrderCancelList
