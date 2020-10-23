const request = require("supertest")
const faker = require("faker")
const mongoose = require("mongoose")
const app = require("../../app")

// IMPORT MODELS
const Ticket = require("../../models/Ticket")
const Order = require("../../models/Order")

it("return an error if ticket doens't exist", async () => {})

it("return an error if ticket is already reserved", async () => {})

it("reserve a ticket", async () => {})
