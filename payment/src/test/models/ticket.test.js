const faker = require("faker")
const mongoose = require("mongoose")
const Ticket = require("../../models/Ticket")

it("It implement optimistic concurency control", async done => {
  const ticket = new Ticket({
    title: faker.commerce.productName(),
    price: faker.commerce.price(),
    userId: new mongoose.Types.ObjectId()
  })

  await ticket.save()

  const firstInstance = await Ticket.findById(ticket.id)
  const secondInstance = await Ticket.findById(ticket.id)

  await firstInstance.set({ price: 10 })
  await secondInstance.set({ price: 15 })

  await firstInstance.save()
  try {
    await secondInstance.save()
  } catch (e) {
    return done()
  }
  throw new Error("Version increment control failing")
})

it("increment the version number on multiple saves", async () => {
  const ticket = new Ticket({
    title: faker.commerce.productName(),
    price: faker.commerce.price(),
    userId: new mongoose.Types.ObjectId()
  })

  await ticket.save()
  expect(ticket.__v).toEqual(0)

  await ticket.save()
  expect(ticket.__v).toEqual(1)

  await ticket.save()
  expect(ticket.__v).toEqual(2)
})
