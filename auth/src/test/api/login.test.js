const request = require("supertest")
const faker = require("faker")
const app = require("../../app")

it("returns a 400 never registered user", async () => {
  return request(app)
    .post("/api/users/login")
    .send({
      email: faker.internet.email(),
      password: faker.internet.password()
    })
    .expect(400)
})

it("returns 400 on incorrect supplied password", async () => {
  const user = {
    email: faker.internet.email(),
    password: faker.internet.password()
  }
  const incorrectPassword = faker.internet.password()

  await request(app).post("/api/users/register").send(user).expect(201)
  await request(app)
    .post("/api/users/login")
    .send({
      ...user,
      password: incorrectPassword
    })
    .expect(400)
})

it("returns a 200 on successfull login user", async () => {
  const user = {
    email: faker.internet.email(),
    password: faker.internet.password()
  }

  await request(app).post("/api/users/register").send(user).expect(201)
  await request(app).post("/api/users/login").send(user).expect(200)
})
