const mongoose = require("mongoose")
const Order = require("./Order")

const Schema = mongoose.Schema

const TicketSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  }
})

TicketSchema.methods.isReserved = async function () {
  const existingOrder = await Order.findOne({
    _ticket: this,
    status: { $in: ["CREATED", "AWAITING_PAYMENT", "COMPLETED"] }
  })
  return existingOrder
}

TicketSchema.options.toJSON = {
  transform(doc, ret) {
    ret.id = ret._id
    delete ret._id
  }
}

module.exports = Ticket = mongoose.model("tickets", TicketSchema)
