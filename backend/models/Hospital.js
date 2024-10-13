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
    },
    location: {
        type: {
            type: String, // Set type to 'Point'
            enum: ['Point'], // Must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number], // Array of numbers for [longitude, latitude]
            required: true
        }
    }
}, { timestamps: true });

// Create a geospatial index on the location field
hospitalSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Hospital', hospitalSchema);
