const request = require("supertest")
const faker = require("faker")
const mongoose = require("mongoose")
const app = require("../../app")

// IMPORT MODELS
const Ticket = require("../../models/Ticket")
const Order = require("../../models/Order")

it("return an error if ticket doens't exist", async () => {
  const ticketId = mongoose.Types.ObjectId()

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.register())
    .send({ ticketId })
    .expect(404)
})

it("return an error if ticket is already reserved", async () => {
  const _ticket = new Ticket({
    title: faker.commerce.productName(),
    price: faker.finance.amount()
  })

  await _ticket.save()
  const order = new Order({
    _ticket,
    userId: mongoose.Types.ObjectId(),
    status: "CREATED",
    expiresAt: new Date()
  })
  await order.save()

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.register())
    .send({ ticketId: _ticket.id })
    .expect(500)
})

it("reserve a ticket", async () => {
  const _ticket = new Ticket({
    title: faker.commerce.productName(),
    price: faker.finance.amount()
  })

  await _ticket.save()

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.register())
    .send({ ticketId: _ticket.id })
    .expect(201)
})

it("return list of order", async () => {
  const cookie = global.register()
  const _ticket = new Ticket({
    title: faker.commerce.productName(),
    price: faker.finance.amount()
  })

  await _ticket.save()
  await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({ ticketId: _ticket.id })
    .expect(201)

  const res = await request(app)
    .get("/api/orders")
    .set("Cookie", cookie)
    .expect(200)

  expect(res.body[0]._ticket.title).toEqual(_ticket.title)
  expect(res.body.length).toEqual(1)
})

it("return a ticket specific to a user", async () => {
  const user = global.register()
  const _ticket = new Ticket({
    title: faker.commerce.productName(),
    price: faker.finance.amount()
  })

  await _ticket.save()
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: _ticket.id })
    .expect(201)

  const res = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .expect(200)

  expect(res.body._ticket.title).toEqual(_ticket.title)
})

it("return a canceled ticket when request delete ticket", async () => {
  const user = global.register()
  const _ticket = new Ticket({
    title: faker.commerce.productName(),
    price: faker.finance.amount()
  })

  await _ticket.save()
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: _ticket.id })
    .expect(201)

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .expect(204)

  const updatedOrder = await Order.findById(order.id)
  expect(updatedOrder.status).toEqual("CANCELLED")
})
