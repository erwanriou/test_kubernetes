const request = require("supertest")
const faker = require("faker")
const app = require("../../../app")

const user = {
  email: faker.internet.email(),
  password: faker.internet.password()
}

it("returns a 201 on sucessfull register", async () => {
  return request(app)
    .post("/api/users/register")
    .send({
      email: faker.internet.email(),
      password: faker.internet.password()
    })
    .expect(201)
})
