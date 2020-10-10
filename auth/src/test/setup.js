const mongoose = require("mongoose")
const faker = require("faker")
const app = require("../app")
const dbhandler = require("./dbhandler")

// CREATE TEST DATABASE
beforeAll(async () => {
  process.env.JWT_KEY = "SADASDAsfdsa"
  await dbhandler.connect()
})

// DROP TEST DABASE
afterEach(async () => await dbhandler.clearDatabase())

// CLOSE TEST DATABSE
afterAll(async () => await dbhandler.closeDatabase())
