const userModel = require("../models/userModel")
const jwt = require("jsonwebtoken");


//==================================   Authentication =============================================//

const authentication = async function (req, res, next) {
    try {
        let token = req.headers["x-api-key"]

        // console.log(token)
        if (!token) token = req.headers["X-API-KEY"]
        if (!token) {
            return res.status(400).send({ status: false, msg: "token not found" })
        }
    
        let decodedtoken = jwt.verify(token, process.env.SECRET_KEY)
        if (!decodedtoken) {
            return res.status(401).send({ status: false, msg: "invalid token" })
        }
        let adminId =decodedtoken._id;


        req._id = adminId


        next()
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}

// ================================  Authorisation  ============================================= //

const authorization = async function (req, res, next) {

    try {
        let token = req.headers["x-api-key"]
        // if(!token)token = req.headers["X-API-KEY"]
        let decodedtoken = jwt.verify(token, "Recoveror")
        let adminId = decodedtoken._id;
       
console.log(adminId)
        let admin = await userModel.findOne({_id:adminId, userType: "Admin"})
        if(!admin){
            return res.status(403).send({status:false, msg:"You are not admin"})
            
        }
        // let data= req.params
        // if(adminId!=data._id){
        //     return res.status(403).send({status:false, msg:"You are not authroise to add member only admin can "})
        // }
       

        next()
    }
    catch (error) {
        return res.status(500).send({ status: false, msg: error.message })

    }

}

module.exports = {authentication, authorization}