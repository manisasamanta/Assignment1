const mongoose = require('mongoose')

const connectDB = async(req,res)=>{
    try{
     const conn = await mongoose.connect(process.env.MONGO_URL)
     console.log(`connected to mongodb database`);
    }catch(error){
        console.log(`error in mongodb database ${error}`);
    }
}

module.exports = connectDB