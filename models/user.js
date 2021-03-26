const mongoose = require("mongoose")
const schema = mongoose.Schema

const userSchema = new schema({
    email : String,
    uid : String,
    username : String,
    full_name : String,
    photo_url : String,
    kontak : String,
    alamat : String,
})

const user = mongoose.model("user", userSchema, "user")
module.exports = user