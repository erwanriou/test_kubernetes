const mongoose = require("mongoose")
const faker = require("faker")
const dbhandler = require("./dbhandler")

// CREATE TEST DATABASE
beforeAll(async () => {
  process.env.JWT_KEY = faker.random.uuid()
  await dbhandler.connect()
})

// DROP TEST DABASE
beforeEach(async () => await dbhandler.clearDatabase())

// CLOSE TEST DATABSE
afterAll(async () => await dbhandler.closeDatabase())
