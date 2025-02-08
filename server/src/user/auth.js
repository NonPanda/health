const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/userModel'); 
const Doctor = require('../models/doctorModel'); 
require('dotenv').config();

/*********************************************************
                      Register
*********************************************************/
const register = async (role, name, email, password) => {
    try {
        const Model = role === 'doctor' ? Doctor : User;

        const existingEntity = await Model.findOne({ email });
        if (existingEntity) {
            return {
                message: `${role === 'doctor' ? 'Doctor' : 'User'} already exists`,
                status: 403
            };
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newEntity = new Model({
            name,
            email,
            password: hashedPassword,
        });

        await newEntity.save();

        const token = jwt.sign({ userId: newEntity._id }, process.env.JWT_SECRET);

        return {
            message: `${role === 'doctor' ? 'Doctor' : 'User'} created successfully`,
            token: token,
            status: 200
        };
    } catch (error) {
        console.error(`Error in ${role} registration:`, error);
        return {
            message: `Error registering ${role}`,
            status: 500
        };
    }
};

/*********************************************************
                      Login
*********************************************************/
const login = async (role, email, password) => {
    try {
        const Model = role === 'doctor' ? Doctor : User;

        const entity = await Model.findOne({ email });
        if (!entity) {
            return {
                message: `${role === 'doctor' ? 'Doctor' : 'User'} not found`,
                status: 404
            };
        }

        const isMatch = await bcrypt.compare(password, entity.password);
        if (!isMatch) {
            return { message: 'Invalid credentials', status: 401 };
        }

        const token = jwt.sign({ userId: entity._id }, process.env.JWT_SECRET);

        return {
            message: `${role === 'doctor' ? 'Doctor' : 'User'} logged in successfully`,
            token: token,
            status: 200
        };
    } catch (error) {
        console.error(`Error in ${role} login:`, error);
        return { message: `Error logging in ${role}`, status: 500 };
    }
};

/*********************************************************
                      Edit User/Doctor
*********************************************************/
const editEntity = async (role, entityId, updates) => {
    try {
        const Model = role === 'doctor' ? Doctor : User;

        const entity = await Model.findById(entityId);
        if (!entity) {
            return {
                message: `${role === 'doctor' ? 'Doctor' : 'User'} not found`,
                status: 404
            };
        }

        if (updates.name) entity.name = updates.name;
        if (updates.email) entity.email = updates.email;
        if (updates.password) {
            const salt = await bcrypt.genSalt(10);
            entity.password = await bcrypt.hash(updates.password, salt);
        }

        await entity.save();

        return {
            message: `${role === 'doctor' ? 'Doctor' : 'User'} updated successfully`,
            status: 200
        };
    } catch (error) {
        console.error(`Error in updating ${role}:`, error);
        return {
            message: `Error updating ${role}`,
            status: 500
        };
    }
};

/*********************************************************
                      Forgot Password
*********************************************************/
async function sendEmail(to, subject, html) {
    try {
        let transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: `"Health App" <${process.env.EMAIL_USER}>`,
            to: to,
            subject: subject,
            html: html,
        });
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

/*********************************************************
                      Validate Token
*********************************************************/
const validateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.status(401).json({ error: 'Authorization header missing' });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Token missing' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { userId } = decoded;

        const user = await User.findById(userId) || await Doctor.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired' });
        }
        res.status(500).json({ error: error.message });
    }
};

/*********************************************************
                      Validate Admin
*********************************************************/
const validateAdmin = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.status(401).json({ error: 'Authorization header missing' });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Token missing' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId) || await Doctor.findById(decoded.userId);

        if (!user || user.role !== 1) {
            return res.status(403).json({ error: 'Access denied' });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { register, login, editEntity, sendEmail, validateToken, validateAdmin };
