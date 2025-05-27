const express  = require('express')

const router = express.Router()


// handler fetching

const {signup}  =require("../controller/Authcontroller")
const {login} = require("../controller/Authcontroller")
const {checkAuth}  = require("../controller/Authcontroller")

// mapping
router.get("/check-auth", checkAuth);
router.post("/signup" , signup)
router.post("/login" , login)

module.exports = router