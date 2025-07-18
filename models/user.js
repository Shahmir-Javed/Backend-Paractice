const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://TestingProjects:shahmir098@cluster0.orj804d.mongodb.net/")


const userSchema =  mongoose.Schema({
    name: String,
    email: String,
    password: String,
    age : Number
})

const User = mongoose.model("User", userSchema);

module.exports = User