const User = require('../models/userModel.js');
const Doctor= require('../models/doctorModel.js');
const { compare } = require('bcrypt');
const {TryCatch, ErrorHandler,cookieOptions,sendToken}=require('../constants/config.js');

const register = TryCatch(async (req, res, next) => {
    const { name, email, password} = req.body;
    const user = await User.create({
        name,
        email,
        password,
    });

    sendToken(res, user, 201, "User Created");
});

const login = TryCatch(async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) return next(new ErrorHandler("Invalid email or password", 404));

    console.log(user);
    
    const isMatch = await compare(password, user.password);
    console.log(isMatch);
    if (!isMatch) return next(new ErrorHandler("Invalid email or password", 404));

    const doctor= await Doctor.findOne({user: user._id});
    console.log(doctor);
    if(doctor){
        user.role="doctor";
    }

    sendToken(res, user, 200, `Welcome back ${user.name}`);
});

const getProfile = TryCatch(async (req, res, next) => {
    const user = await User.findById(req.user);
    if (!user) return next(new ErrorHandler("User not found", 404));
    res.status(200).json({
        success: true,
        user,
    });
});

const updateProfile = TryCatch(async (req, res, next) => {
    const updateduser = await User.findByIdAndUpdate(
        req.user,
        { $set: req.body },
        { new: true }
    );
    if (!updateduser) return next(new ErrorHandler("User not found", 404));
    res.status(200).json({
        success: true,
        user: updateduser,
    });
    
});


module.exports = { register, login,getProfile, updateProfile };