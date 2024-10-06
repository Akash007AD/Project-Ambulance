// backend/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Driver = require('../models/Driver');
const Hospital = require('../models/Hospital');

// Utility function to generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// 1. User Signup
const signupUser = async (req, res) => {
    const { name, phone, password } = req.body;
    try {
        // Check if user already exists
        const userExists = await User.findOne({ phone });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const user = await User.create({
            name,
            phone,
            password: hashedPassword,
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            phone: user.phone,
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// 2. User Login
const loginUser = async (req, res) => {
    const { phone, password } = req.body;
    try {
        // Check if user exists
        const user = await User.findOne({ phone });
        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user._id,
                name: user.name,
                phone: user.phone,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// 3. Driver Signup
const signupDriver = async (req, res) => {
    const { name, phone, password, vehicleNumber, drivingLicense, licenseImage } = req.body;
    try {
        // Check if driver already exists
        const driverExists = await Driver.findOne({ phone });
        if (driverExists) {
            return res.status(400).json({ message: 'Driver already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new driver
        const driver = await Driver.create({
            name,
            phone,
            password: hashedPassword,
            vehicleNumber,
            drivingLicense,
            licenseImage,
            isAvailable: false,
        });

        res.status(201).json({
            _id: driver._id,
            name: driver.name,
            phone: driver.phone,
            vehicleNumber: driver.vehicleNumber,
            token: generateToken(driver._id),
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// 4. Driver Login
const loginDriver = async (req, res) => {
    const { phone, password } = req.body;
    try {
        // Check if driver exists
        const driver = await Driver.findOne({ phone });
        if (driver && (await bcrypt.compare(password, driver.password))) {
            res.json({
                _id: driver._id,
                name: driver.name,
                phone: driver.phone,
                vehicleNumber: driver.vehicleNumber,
                token: generateToken(driver._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// 5. Hospital Signup
const signupHospital = async (req, res) => {
    const { name, registrationNumber, password } = req.body;
    try {
        // Check if hospital already exists
        const hospitalExists = await Hospital.findOne({ registrationNumber });
        if (hospitalExists) {
            return res.status(400).json({ message: 'Hospital already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new hospital
        const hospital = await Hospital.create({
            name,
            registrationNumber,
            password: hashedPassword,
        });

        res.status(201).json({
            _id: hospital._id,
            name: hospital.name,
            registrationNumber: hospital.registrationNumber,
            token: generateToken(hospital._id),
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// 6. Hospital Login
const loginHospital = async (req, res) => {
    const { registrationNumber, password } = req.body;
    try {
        // Check if hospital exists
        const hospital = await Hospital.findOne({ registrationNumber });
        if (hospital && (await bcrypt.compare(password, hospital.password))) {
            res.json({
                _id: hospital._id,
                name: hospital.name,
                registrationNumber: hospital.registrationNumber,
                token: generateToken(hospital._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    signupUser,
    loginUser,
    signupDriver,
    loginDriver,
    signupHospital,
    loginHospital,
};
