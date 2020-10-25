const mongoose = require("mongoose")

module.exports = async mongoDbConnect => {
  // CONNECT MONGOOSE
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
}
