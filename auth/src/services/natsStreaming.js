const { NatsWrapper } = require("./natsWrapper")

module.exports = async natsStreaming => {
  console.log("HELL WORLD")
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
}
