const mongoose = require("mongoose")

const Schema = mongoose.Schema

const OrderSchema = new Schema({
  _ticket: {
    type: Schema.Types.ObjectId,
    ref: "tickets"
  },
  userId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
})

OrderSchema.options.toJSON = {
  transform(doc, ret) {
    ret.id = ret._id
    delete ret._id
  }
}

module.exports = Order = mongoose.model("orders", OrderSchema)
