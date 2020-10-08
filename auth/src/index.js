const express = require("express")
const bodyParser = require("body-parser")

// IMPORT ROUTES
const routes = require("./routes")

// IMPORT MIDDLWARES
const errorHandler = require("./middlewares/errorHandler")

// LAUNCH EXPRESS
const app = express()

// USE MAIN MIDDLWWARE
app.use(bodyParser.json())

// USE ROUTES
routes.map(route => app.use(route.url, route.path))

// USE CUSTOM MIDDLWWARE
app.use(errorHandler)

// LISTEN APP
app.listen(3000, () => {
  console.log("listening on port 3000!")
})
