const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config(); 
mongoose.connect(process.env.mongo_uri).then(()=>{
  console.log("Connected");
}).catch((err)=>{
 console.error("Error in DB : ",err);
});
    
