const Doctor = require('../models/doctorModel.js');
const {TryCatch, ErrorHandler,cookieOptions,sendToken}=require('../constants/config.js');
const { compare } = require('bcrypt');


const login = TryCatch(async (req, res, next) => {
    const { email, password } = req.body;
    const doctor = await Doctor.findOne({ email }).select("+password");
    if (!doctor) return next(new ErrorHandler("Invalid email or password", 404));
    const isMatch = await compare(password, doctor.password);
    if (!isMatch) return next(new ErrorHandler("Invalid email or password", 404));
    sendToken(res, doctor, 200, `Welcome back ${doctor.name}!`);
}
);

const logout = TryCatch(async (req, res) => {
    return res.status(200).cookie("token", "", { ...cookieOptions, maxAge: 0 }).json({
        success: true,
        message: "Logged out",
    });
});

const register = TryCatch(async (req, res, next) => {
    const { name, email, password} = req.body;
    const doctor = await Doctor.create({
        name,
        email,
        password,
    });
    sendToken(res, doctor, 201, "Doctor Created");
}
);


const getProfile = TryCatch(async (req, res, next) => {
    const doctor = await Doctor.findById(req.user);
    if (!doctor) return next(new ErrorHandler("User not found", 404));
    res.status(200).json({
        success: true,
        doctor,
    });
});

const updateProfile = TryCatch(async (req, res, next) => {
    const updateddoctor = await Doctor.findByIdAndUpdate(
        req.user,
        { $set: req.body },
        { new: true }
    )
    if (!updateddoctor) return next(new ErrorHandler("User not found", 404));
    res.status(200).json({
        success: true,
        doctor: updateddoctor,
    });
    
});



module.exports = { updateProfile, getProfile, register, login, logout};