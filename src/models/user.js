const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    username:{
        type: String,
        required: true,
        unique: true
    },
    email:{
        type: String,
        required: true,
        unique: true, 
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password:{
        type: String,
        required: true,
    },
    bio:{
        type: String,
        required: false
    },
    profileImage:{
        type: String,
        required: false,
    },
    isVerified:{
        type: Boolean,
        default: false
    },
    resetPasswordToken:{
        type: String,
        required: false
    },
    resetPasswordExpiration:{
        type: Date,
        required: false
    }
},{timestamps: true});

module.exports = mongoose.model('User', userSchema);