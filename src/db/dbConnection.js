
import mongoose from  'mongoose';
const connectDb=async ()=>{
    try{
        
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Mongo Db Connected");
    
    }
    catch(err)
    {
        console.log("❌Error in Connection",err);
        process.exit(1);
    }
}

export default connectDb;
