const mongoose = require("mongoose")
const faker = require("faker")
const request = require("supertest")

// IMPORT HELPERS
const dbhandler = require("./dbhandler")
const app = require("../app")

// CREATE TEST DATABASE
beforeAll(async () => {
  process.env.JWT_KEY = faker.random.uuid()
  await dbhandler.connect()
})

// DROP TEST DABASE
beforeEach(async () => await dbhandler.clearDatabase())

// CLOSE TEST DATABSE
afterAll(async () => await dbhandler.closeDatabase())

// GLOBAL SCOPE
global.register = async user => {
  const res = await request(app)
    .post("/api/users/register")
    .send(user)
    .expect(201)

  return res.get("Set-Cookie")
}
