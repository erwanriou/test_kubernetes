const request = require("supertest")
const faker = require("faker")
const mongoose = require("mongoose")
const app = require("../../app")
const Order = require("../../models/Order")
const Payment = require("../../models/Payment")
const { Stripe } = require("../../services/stripe")

it("Return a 404 when purcharge an order that doesnt exist", async () => {
  await request(app)
    .post("/api/payments")
    .set("Cookie", global.register())
    .send({
      orderId: mongoose.Types.ObjectId().toHexString(),
      token: faker.random.uuid()
    })
    .expect(404)
})

it("Return a 401 when purcharge an order that doesn't belong to the connected user", async () => {
  const order = new Order({
    _id: mongoose.Types.ObjectId().toHexString(),
    __v: 0,
    userId: mongoose.Types.ObjectId().toHexString(),
    price: faker.finance.amount(),
    status: "CREATED"
  })

  await order.save()

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.register())
    .send({
      orderId: order.id,
      token: faker.random.uuid()
    })
    .expect(401)
})

it("Return a 400 when purcharge an order that is of status cancelled", async () => {
  const userId = mongoose.Types.ObjectId().toHexString()
  const login = global.register(userId)

  const order = new Order({
    _id: mongoose.Types.ObjectId().toHexString(),
    __v: 0,
    userId,
    price: faker.finance.amount(),
    status: "CANCELLED"
  })

  await order.save()

  await request(app)
    .post("/api/payments")
    .set("Cookie", login)
    .send({
      orderId: order.id,
      token: faker.random.uuid()
    })
    .expect(400)
})

it("return a 201 with a valid input", async () => {
  const userId = mongoose.Types.ObjectId().toHexString()
  const login = global.register(userId)

  const order = new Order({
    _id: mongoose.Types.ObjectId().toHexString(),
    __v: 0,
    userId,
    price: faker.finance.amount(),
    status: "CREATED"
  })

  await order.save()

  await request(app)
    .post("/api/payments")
    .set("Cookie", login)
    .send({
      orderId: order.id,
      token: "tok_visa"
    })
    .expect(201)

  const chargeOptions = Stripe.charges.create.mock.calls[0][0]
  const chargeResult = await Stripe.charges.create.mock.results[0].value

  expect(chargeOptions.source).toEqual("tok_visa")
  expect(chargeOptions.amount).toEqual(order.price * 100)
  expect(chargeOptions.currency).toEqual("eur")

  const payment = await Payment.findOne({
    orderId: order.id,
    stripeId: chargeResult.id
  })

  expect(payment).toBeDefined()
  expect(payment.orderId).toEqual(order.id)
  expect(payment.stripeId).toEqual(chargeResult.id)
})
