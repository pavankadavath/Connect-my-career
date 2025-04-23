
const mongoose = require("mongoose");
require("dotenv").config();
mongoose.set("strictQuery",false)
const connectDB=async()=>{
  try{
    const conn=await mongoose.connect(process.env.MONGO_URI,{
      // useNewUrlParser:true,
      // useUnifiedTopology:true
    })
    // console.log(`Connected to MongoDB ${conn.connection.host}`)
    console.log(`Connected to MongoDB`)
  }catch(error){
    console.error(`Error mongoDB connection at${error}`)
    process.exit(1)
  }
}
module.exports = connectDB;
