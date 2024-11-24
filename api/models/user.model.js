const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

// Define the schema for our User model
let userSchema = new Schema({
    name: {
        type: String
    },
    password: {
        type: String
    },
    email: {
        type: String,
        unique: true // Ensures that the email field is unique for each user
    },
    company: {
        type: String
    },
    role: {
        type: String
    },
    comments: {
        type: [String],
        default: []
    }
}, {
    collection: 'users'
})

// Use the uniqueValidator plugin to enforce uniqueness on the 'email' field
// Provides a custom error message if the validation fails
userSchema.plugin(uniqueValidator, { message: 'Esta cuenta ya ha sido registrada' });
// Export the User model
module.exports = mongoose.model('User', userSchema);