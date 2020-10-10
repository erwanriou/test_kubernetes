const app = require("./app")
const connectDatabase = require("./services/database")

// CONNECT DATABASE
connectDatabase()

// LISTEN APP
app.listen(3000, () => {
  console.log("listening on port 3000!")
})
