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



const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({
        success: true,
        user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: req.body },
      { new: true }
    );
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { register, login,getProfile, updateProfile };