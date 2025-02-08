const User = require('../models/userModel.js');
const Doctor= require('../models/doctorModel.js');
const { compare } = require('bcrypt');
const {TryCatch, ErrorHandler,cookieOptions,sendToken}=require('../constants/config.js');
const {getcoordinates}=require('../middlewares/geo.js');

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

    
    const isMatch = await compare(password, user.password);
    if (!isMatch) return next(new ErrorHandler("Invalid email or password", 404));

    // const doctor= await Doctor.findOne({user: user._id});
    // if(doctor){
    //     user.role="doctor";
    // }

    sendToken(res, user, 200, `Welcome back ${user.name}!`);

});

const logout = TryCatch(async (req, res) => {
    return res.status(200).cookie("token", "", { ...cookieOptions, maxAge: 0 }).json({
        success: true,
        message: "Logged out",
    });
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

const userlocate = TryCatch(async (req, res, next) => {
    const user = await User.findById(req.user);
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }
  
    let ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    console.log("User IP detected:", ip);
  
    if (!ip) {
      return next(new ErrorHandler("No IP address detected", 400));
    }
  
    const locationData = await getcoordinates(ip);
    if (!locationData || !locationData.coordinates) {
      return next(new ErrorHandler("Failed to retrieve location data", 500));
    }
  
    user.profile.location = locationData;
    await user.save();
  
    res.json({
      success: true,
      message: "User located",
      location: user.profile.location,
    });
  });

module.exports = { register, login,logout,getProfile, updateProfile, userlocate };