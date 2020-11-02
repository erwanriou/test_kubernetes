const app = require("./app")
const transaction = require("./services/transactions")

// CONNECT DATABASE
console.log("Connecting")
transaction("Payment")

// LISTEN APP
app.listen(3000, () => {
  console.log("listening on port 3000!")
})
