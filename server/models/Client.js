// This is the place where we write code to get data from db
const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: { 
        type: String,
    },
    phone: {
        type: String,
    }
});

module.exports = mongoose.model('Client', ClientSchema);