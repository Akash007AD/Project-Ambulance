// backend/controllers/hospitalController.js
const Hospital = require('../models/Hospital');

const updateBedAvailability = async (req, res) => {
    const { id } = req.params;
    const { bedAvailability } = req.body;

    try {
        const hospital = await Hospital.findById(id);
        if (!hospital) return res.status(404).json({ error: 'Hospital not found' });

        hospital.bedAvailability = bedAvailability;
        await hospital.save();
        res.json(hospital);
    } catch (error) {
        res.status(500).json({ error: 'Error updating bed availability' });
    }
};

module.exports = { updateBedAvailability };
