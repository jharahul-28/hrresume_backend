const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, "Username is required"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: [true,"Email already in use"]
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    resume_url: {
        type: String,
        required: [true, "Resume is required"]
    },
    years_of_experience: {
        type: Number,
        required: [true, "Years of experience is required"],
        min: [0, "Experience cannot be negative"]
    },
    job_role: {
        type: String,
        required: [true, "Job role is required"]
    },
    preferred_location: {
        type: String,
        required: [true, "Preferred location is required"]
    },
    additional_info: {
        type: String, // You can also make this an object or array if needed
        required: false
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
