const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    email: String,
    password: String,
    ip: String,
    loginToken: String,
    date: Date,
}, { timestamps: true });

module.exports = mongoose.model('User', Schema);

