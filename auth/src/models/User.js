const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const Schema = mongoose.Schema
const number = Math.random().toString()

const UserSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  passwordHash: {
    type: String,
    default: bcrypt.hashSync(number, 12)
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  updatedAt: {
    type: Date
  }
})

// MANAGE PASSWORD ENCRYPTION DONT USE ARROW FUNCTIONS
UserSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.passwordHash)
}

UserSchema.virtual("password").set(function (value) {
  this.passwordHash = bcrypt.hashSync(value, 12)
})

UserSchema.options.toJSON = {
  transform(doc, ret) {
    ret.id = ret._id
    delete ret._id
    delete ret.passwordHash
    delete ret.__v
  }
}

module.exports = User = mongoose.model("users", UserSchema)
