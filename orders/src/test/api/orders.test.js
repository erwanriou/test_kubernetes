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
    .expect(400)
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
