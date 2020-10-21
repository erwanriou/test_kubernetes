const importCommon = require("@erwanriou/ticket-shop-common")
const app = require("./app")
const connect = importCommon("services", "database")

// CONNECT DATABASE
connect("Orders")

// LISTEN APP
app.listen(3000, () => {
  console.log("listening on port 3000!")
})
