const express = require("express")

// IMPORT MIDDLWARES
const importCommon = require("@erwanriou/ticket-shop-common")
const isLogged = importCommon("middlewares", "isLogged")
// DECLARE ROUTER
const router = express.Router()

router.post("/", isLogged, async (req, res) => {
  res.status(201).send({})
})

module.exports = router
