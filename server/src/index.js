const express = require("express")
require("dotenv").config()
const mongoose= require("mongoose")
const app = express()
const route = require("./routes/route")
const cors = require("cors")

app.use(cors())



// dotenv.config()


app.use(express.json())

app.use("/", route)



mongoose.connect(process.env.MONGO_URL, {useNewUrlParser:true})
.then(()=>console.log("I am MongoDb my profession is save data"))
.catch((err)=>console.log(err))


const port = process.env.PORT || 3001;

app.listen(port, ()=>{
    console.log("App is running on port "+ port)
})
