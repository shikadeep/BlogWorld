const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const LoginRoutes = require('./Routes/LoginRoutes');
const authMiddleware = require('./Middleware/Auth')


const blogRoutes = require('./Routes/BlogRoutes')
const app = express();
const path = require('path');

dotenv.config(); //env fie
require('./db'); //connent DB

app.use(cors()); //middleware


app.use('/uploads', express.static('uploads'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); //middleware

//routes
app.use('/api', LoginRoutes);
app.use('/api/blogs', blogRoutes);

//middleware
app.get('/api/protected', authMiddleware, (req, res)=>{
  res.json({msg:'You are authenticated', userId: req.user.id});
});
// app.get('/',(req,res)=>{
//   res.send("welcome")
// })

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
