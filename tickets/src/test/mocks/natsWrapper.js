const NatsWrapper = {
  client: {
    publish: jest.fn().mockImplementation((subject, data, callback) => {
      callback()
    })
  }
}

exports.NatsWrapper = NatsWrapper
