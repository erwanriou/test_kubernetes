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

// MANAGE PASSWORD ENCRYPTION
UserSchema.methods.validPassword = password => {
  return bcrypt.compareSync(password, this.passwordHash)
}

UserSchema.virtual("password").set(value => {
  this.passwordHash = bcrypt.hashSync(value, 12)
})

module.exports = User = mongoose.model("users", UserSchema)
