const { NatsWrapper } = require("./natsWrapper")
const { TicketCreatedList } = require("../events/listeners/ticketCreatedList")
const { TicketUpdatedList } = require("../events/listeners/ticketUpdatedList")

module.exports = async natsStreaming => {
  // CONNECT NATS
  await NatsWrapper.connect(
    process.env.NATS_CLUSTER_ID,
    process.env.NATS_CLIENT_ID,
    process.env.NATS_URL
  )
  // GRACEFULLY CLOSE
  NatsWrapper.client().on("close", () => {
    console.log("NATS connection closed")
    process.exit()
  })
  process.on("SIGINT", () => NatsWrapper.client().close())
  process.on("SIGTERM", () => NatsWrapper.client().close())

  // LISTENNING TRAFFIC
  new TicketCreatedList(NatsWrapper.client()).listen()
  new TicketUpdatedList(NatsWrapper.client()).listen()
}
