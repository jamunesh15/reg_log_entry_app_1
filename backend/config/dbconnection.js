const mongoose = require('mongoose')

const dbconnection = ()=>{
     require("dotenv").config();
    mongoose.connect(process.env.DATABASE_URL)
    .then(()=>{
        console.log("connection with db succesfull");
        
    }).catch((error)=>{
        console.log("cannot connect with db");
        
    })
  

}

module.exports =  dbconnection;