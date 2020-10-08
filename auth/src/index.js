const express = require("express")
const bodyParser = require("body-parser")
const routes = require("./routes")

const app = express()
app.use(bodyParser.json())
console.log(routes)
routes.map(route => app.use(route.url, route.path))

app.listen(3000, () => {
  console.log("listening on port 3000!")
})
