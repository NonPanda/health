const {compare}=require('bcrypt');
const Doctor = require('../models/doctorModel.js');
const {TryCatch, ErrorHandler,cookieOptions,sendToken}=require('../constants/config.js');

const getDoctorProfile=TryCatch(async(req,res,next)=>{
    const doctor=await Doctor.findById(req.user._id);
    if(!doctor) return next(new ErrorHandler("Doctor not found",404));
    res.status(200).json({
        success:true,
        doctor,
    });
});

const updateDoctorProfile=TryCatch(async(req,res,next)=>{
    const doctor=await Doctor.findByIdAndUpdate(
        req.user._id,
        {$set:req.body},
        {new:true}
    );
    if(!doctor) return next(new ErrorHandler("Doctor not found",404));
    res.status(200).json({
        success:true,
        doctor,
    });
});

module.exports = { getDoctorProfile, updateDoctorProfile };