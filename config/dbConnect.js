const mongoose = require("mongoose");
const url =process.env.MONGODB_URL;
      
mongoose.set('strictQuery',false); 
//fix default value in mongoose.v7 is required

const connectDB = async ()=> {
    try{
        const con = await mongoose.connect(url);
        console.log(`MongoDB connected: ${con.connection.host}`);
        // connection.host meaning is cluster name
    } catch(err){
        console.log(err);
    }
};

module.exports = connectDB;