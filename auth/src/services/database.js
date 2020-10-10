const mongoose = require("mongoose")

module.exports = async () => {
  try {
    await mongoose.connect("mongodb://auth-srv-mongo:27017/auth", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
    console.log("Auth Mongodb Connected")
  } catch (e) {
    console.error(e)
  }
}
