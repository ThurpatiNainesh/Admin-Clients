
const express = require("express")
const router = express()
const userController = require("../controllers/userController")
const admin = require("../controllers/Admin")
const auth = require("../middleware/authentication")

router.post("/admin",admin.adminRegister)
router.post("/registerMember", auth.authentication,auth.authorization,userController.createUser)
router.post("/login", userController.loginUser)
router.get("/getMember/:_id", auth.authentication, userController.getMember)
router.delete("/delete/:memberId" ,auth.authentication,auth.authorization, userController.deleteMember)

router.all("/*", (req, res)=>{
    console.log("Make sure route path is correct ")
    res.status(400).send("Make sure route path is correct")
})

module.exports =router