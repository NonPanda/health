const {compare}=require('bcrypt');
const Doctor = require('../models/doctorModel.js');
const {TryCatch, ErrorHandler,cookieOptions,sendToken}=require('../constants/config.js');


const register = TryCatch(async (req, res, next) => {
    const { name, email, password} = req.body;
    const doctor = await Doctor.create({
        name,
        email,
        password,
    });

    sendToken(res, doctor, 201, "Doctor Created");
});
const login = TryCatch(async (req, res, next) => {
    const { email, password } = req.body;
    const doctor = await Doctor.findOne({ email }).select("+password");
    if (!doctor) return next(new ErrorHandler("Invalid email or password", 404));

    console.log(doctor);
    
    const isMatch = await compare(password, doctor.password);
    console.log(isMatch);
    if (!isMatch) return next(new ErrorHandler("Invalid email or password", 404));

    sendToken(res, doctor, 200, `Welcome back ${doctor.name}`);
});

module.exports = { register, login };