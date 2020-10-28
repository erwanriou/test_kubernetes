const natsStreaming = require("./natsStreaming")

module.exports = async client => {
  try {
    // CONNECT NATS
    await natsStreaming()
  } catch (e) {
    console.error(e)
  }
}
