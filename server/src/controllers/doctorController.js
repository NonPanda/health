const Doctor = require('../models/doctorModel.js');
const {TryCatch, ErrorHandler}=require('../constants/config.js');

const getProfile = TryCatch(async (req, res, next) => {
    const doctor = await Doctor.findOne({user: req.user});
    if (!doctor) return next(new ErrorHandler("User not found", 404));
    res.status(200).json({
        success: true,
        doctor,
    });
});

const updateProfile = TryCatch(async (req, res, next) => {
    const updateduser = await Doctor.findOneAndUpdate(
        {user: req.user},
        { $set: req.body },
        { new: true }
    )
    if (!updateduser) return next(new ErrorHandler("User not found", 404));
    res.status(200).json({
        success: true,
        user: updateduser,
    });
    
});


module.exports = { updateProfile, getProfile };