const mongoose = require("mongoose")

module.exports = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
    console.log("Auth Mongodb Connected")
  } catch (e) {
    console.error(e)
  }
}
