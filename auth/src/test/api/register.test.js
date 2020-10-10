const request = require("supertest")
const faker = require("faker")
const app = require("../../app")

it("returns a 201 on sucessfull register", async () => {
  return request(app)
    .post("/api/users/register")
    .send({
      email: faker.internet.email(),
      password: faker.internet.password()
    })
    .expect(201)
})

it("returns a 400 with an invalid email", async () => {
  return request(app)
    .post("/api/users/register")
    .send({
      email: faker.lorem.word(),
      password: faker.lorem.paragraphs()
    })
    .expect(400)
})

it("returns a 400 with an invalid password", async () => {
  return request(app)
    .post("/api/users/register")
    .send({
      email: faker.lorem.word(),
      password: faker.lorem.paragraphs()
    })
    .expect(400)
})

it("returns a 400 with an missing email and password", async () => {
  await request(app)
    .post("/api/users/register")
    .send({
      email: faker.internet.email()
    })
    .expect(400)
  await request(app)
    .post("/api/users/register")
    .send({
      password: faker.internet.password()
    })
    .expect(400)
})

it("disallows duplicate emails", async () => {
  const user = {
    email: faker.internet.email(),
    password: faker.internet.password()
  }

  await request(app).post("/api/users/register").send(user).expect(201)
  await request(app).post("/api/users/register").send(user).expect(400)
})

it("set a cookie after successfull signup", async () => {
  const user = {
    email: faker.internet.email(),
    password: faker.internet.password()
  }

  const res = await request(app)
    .post("/api/users/register")
    .send(user)
    .expect(201)

  expect(res.get("Set-Cookie")).toBeDefined()
})
