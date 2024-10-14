const mongoose = require('mongoose'); // Import Mongoose for MongoDB object modeling

// Define the user schema
const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true }, // First name of the user (required field)
    lastName: { type: String, required: true }, // Last name of the user (required field)
    userName: { type: String, required: true, unique: true }, // Username for login (unique and required field)
    password: { type: String, required: true }, // Hashed password (required field)
    gender: { type: String, required: true }, // Gender of the user (required field)
    email: { type: String, required: true, unique: true } // Email address of the user (unique and required field)
});

// Export the User model based on the user schema
userSchema.index({ userName: 1 }); // Index `userName` to speed up querie
module.exports = mongoose.model('User', userSchema);
