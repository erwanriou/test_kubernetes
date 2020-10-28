const Queue = require("bull")
const { NatsWrapper } = require("../services/natsWrapper")
const {
  ExpirationCompletedPub
} = require("../events/publishers/expirationCompletedPub")

const expirationQueue = new Queue("order:expiration", {
  redis: {
    host: process.env.REDIS_HOST
  }
})

expirationQueue.process(async job => {
  new ExpirationCompletedPub(NatsWrapper.client()).publish({
    orderId: job.data.orderId
  })
})

exports.expirationQueue = expirationQueue
