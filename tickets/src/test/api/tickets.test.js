const request = require("supertest")
const faker = require("faker")
const app = require("../../app")

it("has a route handler listenning to /api/tickets for posts request", async () => {
  const res = await request(app).post("/api/tickets").send({})

  expect(res.status).not.toEqual(404)
})

it("It can only be accessed if user is signed in", async () => {
  await request(app).post("/api/tickets").send({}).expect(401)
})

it("Return status different than 401 when user is signed in", async () => {
  const res = await request(app).post("/api/tickets").send({})
  expect(res.status).not.toEqual(401)
})

it("Return an error if invalid title is provided", async () => {})

it("Return an error if invalid price is provided", async () => {})

it("Create a ticket with valid inputs", async () => {})
