const request = require("supertest")
const faker = require("faker")
const mongoose = require("mongoose")
const app = require("../../app")
const Ticket = require("../../models/Ticket")

// HELPER CREATE TICKET
const createTicket = async ticket => {
  return await request(app)
    .post("/api/tickets")
    .set("Cookie", global.register())
    .send(ticket)
    .expect(201)
}

it("has a route handler listenning to /api/tickets for posts request", async () => {
  const res = await request(app).post("/api/tickets").send({})

  expect(res.status).not.toEqual(404)
})

it("It can only be accessed if user is signed in", async () => {
  await request(app).post("/api/tickets").send({}).expect(401)
})

it("Return status different than 401 when user is signed in", async () => {
  const res = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.register())
    .send({})

  expect(res.status).not.toEqual(401)
})

it("Return an error if invalid title is provided", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.register())
    .send({
      title: "",
      price: 10
    })
    .expect(400)
})

it("Return an error if invalid price is provided", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.register())
    .send({
      title: "First Ticket",
      price: ""
    })
    .expect(400)
})

it("Create a ticket with valid inputs", async () => {
  // Add a check to database
  let tickets = await Ticket.find()

  expect(tickets.length).toEqual(0)
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.register())
    .send({
      title: "First Ticket",
      price: 20
    })
    .expect(201)

  tickets = await Ticket.find()
  expect(tickets.length).toEqual(1)
  expect(tickets[0].price).toEqual(20)
})

it("return a 404 if the ticket is not found", async () => {
  const id = new mongoose.Types.ObjectId().toHexString()
  await request(app).get(`/api/tickets/${id}`).send().expect(404)
})

it("return the ticket if the ticket is found", async () => {
  const ticket = {
    title: "First Ticket",
    price: 20
  }
  const res = await createTicket(ticket)

  const ticketRes = await request(app)
    .get(`/api/tickets/${res.body.id}`)
    .send()
    .expect(200)

  expect(ticketRes.body.title).toEqual("First Ticket")
  expect(ticketRes.body.price).toEqual(20)
})

it("can fetch a list of tickets", async () => {
  Promise.all(
    [...Array(3)].map(async request => {
      const ticket = {
        title: faker.commerce.productName(),
        price: faker.commerce.price()
      }
      await createTicket(ticket)
    })
  )

  await request(app).get(`/api/tickets`).send().expect(200)
})

it("return a 404 if the provider id doesn't exist", async () => {
  const id = new mongoose.Types.ObjectId().toHexString()
  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", global.register())
    .send({
      title: faker.commerce.productName(),
      price: faker.commerce.price()
    })
    .expect(404)
})

it("return a 401 if the user is not authenticated", async () => {
  const id = new mongoose.Types.ObjectId().toHexString()
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: faker.commerce.productName(),
      price: faker.commerce.price()
    })
    .expect(401)
})

it("return a 401  if the user doesn't own the ticket", async () => {
  const ticket = {
    title: faker.commerce.productName(),
    price: faker.commerce.price()
  }
  const res = await createTicket(ticket)

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set("Cookie", global.register())
    .send({
      title: faker.commerce.productName(),
      price: faker.commerce.price()
    })
    .expect(401)
})

it("return a 400 if user provide invalid info", async () => {
  const cookie = global.register()
  const ticket = {
    title: faker.commerce.productName(),
    price: faker.commerce.price()
  }
  const res = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send(ticket)
    .expect(201)

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: faker.commerce.productName(),
      price: faker.internet.password()
    })
    .expect(400)
})

it("Update the ticket if all provided info are corrects", async () => {
  const cookie = global.register()

  const ticket = {
    title: faker.commerce.productName(),
    price: faker.commerce.price()
  }
  const res = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send(ticket)
    .expect(201)

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: faker.commerce.productName(),
      price: faker.commerce.price()
    })
    .expect(200)
})

it("reject update if the ticket is reserved", async () => {
  const cookie = global.register()

  let ticket = {
    title: faker.commerce.productName(),
    price: faker.commerce.price()
  }

  const res = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send(ticket)
    .expect(201)

  ticket = await Ticket.findById(res.body.id)
  ticket.set({ orderId: mongoose.Types.ObjectId().toHexString() })
  await ticket.save()

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: faker.commerce.productName(),
      price: faker.commerce.price()
    })
    .expect(400)
})
