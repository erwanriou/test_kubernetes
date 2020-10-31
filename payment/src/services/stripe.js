const Stripe = require("stripe")

exports.Stripe = new Stripe(process.env.STRIPE_KEY, {
  apiVersion: "2020-03-02"
})
