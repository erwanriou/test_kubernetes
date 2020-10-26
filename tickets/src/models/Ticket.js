const mongoose = require("mongoose")
const { updateIfCurrentPlugin } = require("mongoose-update-if-current")

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
  orderId: {
    type: String
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

TicketSchema.plugin(updateIfCurrentPlugin)

module.exports = Ticket = mongoose.model("tickets", TicketSchema)
