const mongoose = require('mongoose');

const LoginUserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true  }
})
const LoginUser = mongoose.model("LoginUser", LoginUserSchema);
module.exports = LoginUser;