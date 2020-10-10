const mongoose = require("mongoose")
const { MongoMemoryServer } = require("mongodb-memory-server")

const mongo = new MongoMemoryServer()

module.exports.connect = async () => {
  const mongo = new MongoMemoryServer()
  const mongoUri = await mongo.getUri()
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
}

module.exports.clearDatabase = async () => {
  const collections = await mongoose.connection.db.collections()
  for (let collection of collections) {
    await collection.deleteMany({})
  }
}

module.exports.closeDatabase = async () => {
  await mongoose.connection.dropDatabase()
  await mongoose.connection.close()
  await mongo.stop()
}
