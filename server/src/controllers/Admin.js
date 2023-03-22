
const userModel = require("../models/userModel")
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")

const { isValidBody, isValidstring, isValidEmail, isValidphone, isValidPassword } = require("./Validation")


//==========================  Admin SignUp ====================================//

const adminRegister = async (req, res) => {
    try {

        let data = req.body
        if (!isValidBody(data)) {
            return res.status(400).send({ status: false, mag: " Enter data in body" })
        }

        let { name, email, phone, password, gender } = data

        if (!name || !email || !phone  || !password || !gender) {
            return res.status(400).send({ status: false, mag: "please fill all field properly" })
        }

        if (!isValidstring(name)) {
            return res.status(400).send({ status: false, mag: " name should be  only in alphabate" })
        }

        if (!isValidEmail(email)) {
            return res.status(400).send({ status: false, mag: " invalid Email" })
        }

        let uniqueEmail = await userModel.findOne({ email: email })
        if (uniqueEmail) {
            return res.status(422).send({ status: false, mag: " this email already exist" })
        }

        if (!isValidphone(phone)) {
            return res.status(400).send({ status: false, mag: " invalid phone" })
        }
        data.userType = "Admin"
        let uniquePhone = await userModel.findOne({ phone: phone })
        if (uniquePhone) {
            return res.status(422).send({ status: false, mag: " this phone already exist" })
        }

        let arr = ["Male", "Female"]

        if (!arr.includes(gender)) {
            return res.status(400).send({ status: false, mag: " gender should be enum  Male or Female" })
        }
       

        if (!isValidPassword(password)) {
            return res.status(400).send({ status: false, msg: " password contain atleast one spacial character, Number, Alphabet, length should be 8 to 15 " })
        }

        data.password = bcrypt.hashSync(password, 10)


        let savedData = await userModel.create(data)
        return res.status(201).send({ status: true, data: savedData })



    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}

module.exports = {adminRegister}