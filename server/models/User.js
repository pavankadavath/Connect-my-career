const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String
    },
    address: {
        type: String
    },
    skills: {
        type: String
    },
    isStudent: {
        type: Boolean,
        default: false
    },
    studentDetails: {
        admissionNumber: {
            type: String,
            required: function () { return this.isStudent; }
        },
        collegeCode: {
            type: String, 
            required: function () { return this.isStudent; }
        },
        collegeName: {
            type: String, 
            required: function () { return this.isStudent; }
        },
        branch: {
            type: String
        },
        graduationYear: {
            type: Number, 
            default:2025,
            required: function () { return this.isStudent; }
        }
    },
    educationDetails: {
        type: String,
        // required:function () { return this.isStudent; }
    },
    resumeUrl: {
        type: String
    }
}, { timestamps: true }); 

const User = mongoose.model('Users', UserSchema);
module.exports = User;
