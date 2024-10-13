const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    vehicleNumber: { type: String, required: true },
    drivingLicense: { type: String, required: true },
    licenseImage: { type: String, default: null },
    available: { type: Boolean, default: true },
    location: {
        type: {
            type: String, // "Point"
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true,
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true,
        },
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

driverSchema.index({ location: '2dsphere' }); // Create a 2dsphere index for geospatial queries

const Driver = mongoose.model('Driver', driverSchema);
module.exports = Driver;
