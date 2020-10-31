const faker = require("faker")

const Stripe = {
  charges: {
    create: jest.fn().mockResolvedValue({
      id: faker.random.uuid()
    })
  }
}

exports.Stripe = Stripe
