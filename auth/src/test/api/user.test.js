const request = require("supertest")
const faker = require("faker")
const app = require("../../app")

it("Responds with details about the current user", async () => {
  const user = {
    email: faker.internet.email(),
    password: faker.internet.password()
  }

  const cookie = await global.register(user)
  const userRes = await request(app)
    .get("/api/users/user")
    .set("Cookie", cookie)
    .send()
    .expect(200)

  expect(userRes.body.user.email).toEqual(user.email)
})

it("responds null if not authenticated", async () => {
  const res = await request(app).get("/api/users/user").send().expect(200)
  expect(res.body.user).toEqual(null)
})
