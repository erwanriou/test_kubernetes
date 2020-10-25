const mongoDbConnect = require("./mongoDb")
const natsStreaming = require("./natsStreaming")

module.exports = async client => {
  try {
    // CONNECT NATS
    await natsStreaming()
    // CONNECT MONGOOSE
    await mongoDbConnect()
    console.log(`${client} Mongodb Connected`)
  } catch (e) {
    console.error(e)
  }
}
