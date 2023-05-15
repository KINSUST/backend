const mongoose = require("mongoose");
mongoose.set("strictQuery", false); 

// mongoDB connection
const mongoDBConnection = async () => {  
  try {
    const connect = await mongoose.connect( 
      process.env.MONGO_URL 
    );
    console.log(`mongoDB  successfully to ${connect.connection.host}`.bgBlue);
  } catch (error) {
    console.log(`${error.message}`.bgRed)
  }
}; 
 
// export
module.exports = mongoDBConnection; 
   