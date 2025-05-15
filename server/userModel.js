/**
 * userModel.js
 * 
 * This file defines the Mongoose schema and model for the User entity in the application.
 * It includes fields for user authentication, wishlist, cart, orders, and Google OAuth integration.
 * Additionally, it uses plugins for Passport.js local authentication and a utility for finding or creating users.
 */

const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const findOrCreate = require('mongoose-findorcreate');

/**
 * User Schema
 * 
 * Fields:
 * - password: String - The user's password (used for local authentication).
 * - wishList: Array - A list of items the user has added to their wishlist.
 * - cartList: Array - A list of items the user has added to their cart.
 * - orders: Array - A list of orders the user has placed.
 * - googleId: String - The user's Google ID (used for Google OAuth authentication).
 * - displayName: String - The user's display name (retrieved from Google OAuth or set manually).
 * - email: String - The user's email address.
 */
const userSchema = new mongoose.Schema({
    password: String,
    wishList: Array,
    cartList: Array,
    orders: Array,
    googleId: String,
    displayName: String,
    email: String
});

// Apply the Passport.js plugin for local authentication
// Options:
// - usernameUnique: false - Allows duplicate usernames (useful for Google OAuth users without a username).
userSchema.plugin(passportLocalMongoose, { usernameUnique: false });

// Apply the findOrCreate plugin for simplifying user lookup or creation
userSchema.plugin(findOrCreate);

// Create the User model from the schema
const User = mongoose.model('User', userSchema);

// Export the User model for use in other parts of the application
module.exports = User;
