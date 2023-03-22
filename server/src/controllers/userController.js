const userModel = require("../models/userModel")
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")

const { isValidBody, isValidstring, isValidEmail, isValidphone, isValidPassword } = require("./Validation")


//==========================  User SignUp ====================================//

const createUser = async (req, res) => {
    try {

        let data = req.body
        if (!isValidBody(data)) {
            return res.status(400).send({ status: false, msg: " Enter data in body" })
        }

        let { name, email, phone, password, gender } = data

        if (!name || !email || !phone || !password || !gender) {
            return res.status(400).send({ status: false, msg: "please fill all field properly" })
        }

        if (!isValidstring(name)) {
            return res.status(400).send({ status: false, msg: " name should be  only in alphabate" })
        }

        if (!isValidEmail(email)) {
            return res.status(400).send({ status: false, msg: " invalid Email" })
        }


        let uniqueEmail = await userModel.findOne({ email: email })
        if (uniqueEmail) {
            return res.status(422).send({ status: false, msg: " this email already exist" })
        }

        if (!isValidphone(phone)) {
            return res.status(400).send({ status: false, msg: " invalid phone" })
        }

        let uniquePhone = await userModel.findOne({ phone: phone })
        if (uniquePhone) {
            return res.status(422).send({ status: false, msg: " this phone already exist" })
        }

        let arr = ["Male", "Female"]

        if (!arr.includes(gender)) {
            return res.status(400).send({ status: false, msg: " gender should be enum  Male or Female" })
        }
      

        if (!isValidPassword(password)) {
            return res.status(400).send({ status: false, msg: " password contain atleast one spacial character, Number, Alphabet, length should be 8 to 15 " })
        }

        data.password = bcrypt.hashSync(password, 10)
        let adminId = req._id
        // console.log(id)
        data.adminId = adminId
        let allMember = await userModel.find({adminId:adminId})
        let memberId = allMember.length+1
        data.memberId= memberId


        let savedData = await userModel.create(data)
        return res.status(201).send({ status: true,msg:"Member successfuly created", data: savedData })



    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}

//=====================================  Login User API ==========================================//

const loginUser = async (req, res) => {
    try {
        let credentials = req.body
        // console.log(credentials)
        let { userName, password } = credentials

        if (!isValidBody(credentials)) {
            return res.status(400).send({ status: false, msg: "enter all fild properly" })
        }
        if (!userName || !password) {
            return res.status(400).send({ status: false, msg: "Enter userName and password" })
        }

        let customer = await userModel.findOne({ email: userName })
        if (!customer) {
            return res.status(400).send({ status: false, msg: "userName not exist" })
        }
        let valid = await bcrypt.compare(password, customer.password)
        if (!valid) {
            return res.status(401).send({ status: false, msg: " userName or password wrong" })
        }

        let token = jwt.sign({
            _id: customer._id.toString(),
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) * 60 * 60 * 24  // 24 hours
        }, process.env.SECRET_KEY)

        res.setHeader("axe-api-key", token)

        credentials.token = token
        delete credentials.password
        credentials._id = customer._id
        // await credentials.save()

        console.log(customer)
        return res.status(200).send({ status: true, msg: "Login successfully", data: credentials })

    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}

// ============================  GET MEMBER API ========================================//

const getMember = async (req, res) => {
    try {

        let data = req.params
      
        let user = await userModel.find({ adminId: data._id, isDeleted:false })
       
        if (!user) {
            return res.status(404).send({ status: false, msg: "member not found may be deleted" })
        }

        return res.status(200).send({ status: true, data: user })



    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}

// ============================= Delete Member ===================================//

const deleteMember = async (req, res)=>{
    try{
        let data = req.params
       
        let user = await userModel.findOne({memberId: data.memberId, isDeleted:false})
        if(!user){
            return res.status(400).send({status:false, msg:"no user found with this _id or may be deleted"})
        }
        user.isDeleted= true

        user.save()
        return res.status(200).send({status:false, msg:"member deleted successfuly"})


    }catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}


module.exports = { createUser, loginUser, getMember, deleteMember }