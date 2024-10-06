// backend/controllers/ambulanceController.js
const Driver = require('../models/Driver');

const findNearbyAmbulances = async (req, res) => {
    const { lat, lng, radius = 2 } = req.query;

    try {
        const drivers = await Driver.find({
            location: {
                $geoWithin: {
                    $centerSphere: [[lng, lat], radius / 6378.1] // radius in kilometers
                }
            },
            available: true
        });
        res.json(drivers);
    } catch (error) {
        res.status(500).json({ error: 'Error finding ambulances' });
    }
};

module.exports = { findNearbyAmbulances };
