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
  const { userId, profile } = req.body; 

  if (!userId) {
    return next(new ErrorHandler("User ID is required", 400));
  }

  if (!profile || typeof profile !== "object") {
    return next(new ErrorHandler("Invalid profile data", 400));
  }

  if (Object.keys(profile).length === 0) {
    return next(new ErrorHandler("No fields to update", 400));
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId, 
    { $set: { profile } },
    { new: true, runValidators: true }
  );

  if (!updatedUser) {
    return next(new ErrorHandler("User not found", 404));
  }

  res.status(200).json({
    success: true,
    user: updatedUser,
  });
});

const userlocate=TryCatch(async(req,res)=>{
    const ip = req.headers['x-forwarded-for'] || req.ip;
    const user= await User.findById(req.user);
    if(!user.profile.location){
        user.profile.location= await getcoordinates(ip);
        await user.save();
    }
    req.location=user.profile.location;
    if(!req.location) return next(new ErrorHandler("Location not found", 404));
    res.status(200).json({ success: true, message: "User located", location: req.location });
});


module.exports = { register, login,logout,getProfile, updateProfile, userlocate };