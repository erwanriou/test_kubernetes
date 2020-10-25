const nats = require("node-nats-streaming")

class NatsWrapper {
  _client // PROTECTED VALUE

  // RELEASE ACCESS TO CLIENT PROPERTY WHEN DEFINED
  client() {
    if (!this._client) {
      throw new Error("Cannot access client before connecting")
    }
    return this._client
  }

  // CONNECT METHOD
  connect(clusterId, clientId, url) {
    this._client = nats.connect(clusterId, clientId, { url })

    // ASYNCHRONOUS CONNECT
    return new Promise((resolve, reject) => {
      this.client().on("connect", () => {
        console.log("Connected to NATS")
        resolve()
      })
      this.client().on("error", err => {
        reject(err)
      })
    })
  }
}

exports.NatsWrapper = new NatsWrapper()
