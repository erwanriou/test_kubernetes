const mongoose = require("mongoose")
const { updateIfCurrentPlugin } = require("mongoose-update-if-current")
const Schema = mongoose.Schema

const OrderSchema = new Schema({
  userId: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    required: true
  }
})

OrderSchema.plugin(updateIfCurrentPlugin)

OrderSchema.options.toJSON = {
  transform(doc, ret) {
    ret.id = ret._id
    delete ret._id
  }
}

module.exports = Order = mongoose.model("orders", OrderSchema)
