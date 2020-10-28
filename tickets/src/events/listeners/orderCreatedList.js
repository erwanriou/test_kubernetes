const importCommon = require("@erwanriou/ticket-shop-common")
const { Listener } = importCommon("factory", "listener")
const { Subject, QueueGroupName } = importCommon("factory", "types")
const { TicketUpdatedPub } = require("../publishers/ticketUpdatedPub")
const { NatsWrapper } = require("../../services/natsWrapper")

// IMPORT MODELS
const Ticket = require("../../models/Ticket")

// CHILDREN CLASS
class OrderCreatedList extends Listener {
  subject = Subject.ORDER_CREATED
  queueGroupName = QueueGroupName.TICKET_SERVICE

  async onMessage(data, msg) {
    const ticket = await Ticket.findById(data.ticket.id)

    if (!ticket) {
      throw new Error("Ticket not found")
    }

    ticket.set({ orderId: data.id })
    await ticket.save()
    if (process.env.NODE_ENV !== "test") {
      await new TicketUpdatedPub(NatsWrapper.client()).publish(ticket)
    }
    msg.ack()
  }
}

exports.OrderCreatedList = OrderCreatedList
