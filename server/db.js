const mongoose = require('mongoose');
const url = process.env.MONGO_URI;

mongoose.connect(url)
 .then(()=>{
    console.log("......MONGO DB connected");
})
.catch((err)=>{
    console.log("... connection failed", err);
})