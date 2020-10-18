const request = require("supertest")
const faker = require("faker")
const app = require("../../app")
const Ticket = require("../../models/Ticket")

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
