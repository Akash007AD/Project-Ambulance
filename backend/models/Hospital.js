// backend/models/Hospital.js
const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    registrationNumber: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    bedAvailability: {
        type: Number,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Hospital', hospitalSchema);
