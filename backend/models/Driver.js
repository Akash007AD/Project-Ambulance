// backend/models/Driver.js
const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    vehicleNumber: {
        type: String,
        required: true
    },
    drivingLicense: {
        type: String,
        required: true
    },
    licenseImage: {
        type: String,
        required: true
    },
    available: {
        type: Boolean,
        default: true
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            default: [0, 0]
        }
    }
}, { timestamps: true });

module.exports = mongoose.model('Driver', driverSchema);
