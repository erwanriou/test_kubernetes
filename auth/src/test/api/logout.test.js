const request = require("supertest")
const faker = require("faker")
const app = require("../../app")

it("Clear the cookie after logout", async () => {
  await request(app)
    .post("/api/users/register")
    .send({
      email: faker.internet.email(),
      password: faker.internet.password()
    })
    .expect(201)

  const res = await request(app).post("/api/users/logout").send({}).expect(200)
  expect(res.get("Set-Cookie")[0]).toEqual(
    "express:sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly"
  )
})
