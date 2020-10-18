const mongoose = require("mongoose")
const { MongoMemoryServer } = require("mongodb-memory-server")

const mongo = new MongoMemoryServer()

module.exports.connect = async () => {
  const mongo = new MongoMemoryServer()
  const mongoUri = await mongo.getUri()
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
}

module.exports.clearDatabase = async () => {
  const collections = await mongoose.connection.db.collections()
  for (let collection of collections) {
    await collection.deleteMany({})
  }
}

module.exports.closeDatabase = async () => {
  await mongo.stop()
  await mongoose.connection.close()
}
