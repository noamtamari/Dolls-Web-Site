// userModel.js

const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const findOrCreate = require('mongoose-findorcreate');

const userSchema = new mongoose.Schema({
password: String,
    wishList: Array,
    cartList: Array,
    orders: Array,
    googleId: String,
    displayName: String ,
    email: String 
});

// Apply the plugins to the schema
userSchema.plugin(passportLocalMongoose, { usernameUnique: false });
userSchema.plugin(findOrCreate);

const User = mongoose.model('User', userSchema);

module.exports = User;
