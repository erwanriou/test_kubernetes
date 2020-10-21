const mongoose = require("mongoose")
const { NatsWrapper } = require("./eventbus")

module.exports = async () => {
  try {
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
    // CONNECT MONGOOSE
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    })
    console.log("Tickets Mongodb Connected")
  } catch (e) {
    console.error(e)
  }
}
