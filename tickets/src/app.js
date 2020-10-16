require("express-async-errors")
const express = require("express")
const bodyParser = require("body-parser")
const cookieSession = require("cookie-session")

// IMPORT ROUTES
const routes = require("./routes")

// IMPORT MIDDLWARES
const importCommon = require("@erwanriou/ticket-shop-common")
const errorHandler = importCommon("middlewares", "errorHandler")
const isCurrentUser = importCommon("middlewares", "isCurrentUser")
const NotFoundError = importCommon("factory", "errors").NotFoundError

// LAUNCH EXPRESS
const app = express()

// USE MAIN MIDDLWWARE
app.set("trust proxy", true)
app.use(bodyParser.json())
app.use(
  cookieSession({ signed: false, secure: process.env.NODE_ENV !== "test" })
)
app.use(isCurrentUser)
// USE ROUTES
routes.map(route => app.use(route.url, route.path))
app.all("*", async (req, res) => {
  throw new NotFoundError()
})

// USE CUSTOM MIDDLWWARE
app.use(errorHandler)

module.exports = app
