const mongoose = require("mongoose")

const Schema = mongoose.Schema

const TicketSchema = new Schema({
  userId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  updatedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
})

TicketSchema.options.toJSON = {
  transform(doc, ret) {
    ret.id = ret._id
    delete ret._id
  }
}

module.exports = Ticket = mongoose.model("tickets", TicketSchema)
