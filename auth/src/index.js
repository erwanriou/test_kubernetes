require("express-async-errors")
const express = require("express")
const bodyParser = require("body-parser")
const cookieSession = require("cookie-session")

// IMPORT ROUTES
const routes = require("./routes")

// IMPORT SERVICES
const connectDatabase = require("./services/database")

// IMPORT MIDDLWARES
const errorHandler = require("./middlewares/errorHandler")
const NotFoundError = require("./factory/errors").NotFoundError

// LAUNCH EXPRESS
const app = express()

// USE MAIN MIDDLWWARE
app.set("trust proxy", true)
app.use(bodyParser.json())
app.use(cookieSession({ signed: false, secure: true }))

// CONNECT DATABASE
connectDatabase()

// USE ROUTES
routes.map(route => app.use(route.url, route.path))
app.all("*", async (req, res) => {
  throw new NotFoundError()
})

// USE CUSTOM MIDDLWWARE
app.use(errorHandler)

// LISTEN APP
app.listen(3000, () => {
  console.log("listening on port 3000!")
})
