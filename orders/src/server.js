const app = require("./app")
const connect = require("./services/database")

// CONNECT DATABASE
connect("Orders")

// LISTEN APP
app.listen(3000, () => {
  console.log("listening on port 3000!")
})
