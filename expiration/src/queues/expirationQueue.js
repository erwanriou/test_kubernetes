const Queue = require("bull")

const expirationQueue = new Queue("order:expiration", {
  redis: {
    host: process.env.REDIS_HOST
  }
})

expirationQueue.process(async job => {
  console.log("i want to publish an expiration", job.data.orderId)
})

exports.expirationQueue = expirationQueue
