const User = require('../models/userModel.js');
const { compare } = require('bcrypt');
const {TryCatch, ErrorHandler,cookieOptions,sendToken} =require('../constants/config.js');
const {getcoordinates}=require('../middlewares/geo.js');

const register = TryCatch(async (req, res, next) => {
    const { name, email, password} = req.body;
    const duplicate= await User.findOne({email});
    if(duplicate) return next(new ErrorHandler("User already exists", 400));
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

const uploadProfilePicture = TryCatch(async (req, res, next) => {
  const { userId } = req.body;

  
  if (!userId) {
    return next(new ErrorHandler("User ID is required", 400));
  }
  if (!req.file) {
    return next(new ErrorHandler("No file uploaded", 400));
  }
  const user = await User.findById(userId);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  const file = req.file.buffer.toString("base64");
  user.profile.avatar = `data:${req.file.mimetype};base64,${file}`;
  await user.save();

  res.status(200).json({ success: true, user });
});

const userlocate = TryCatch(async (req, res, next) => {
    const user = await User.findById(req.user);
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }
  
    let ip = req.headers["x-forwarded-for"] || req.ip;
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

module.exports = { register, login,logout,getProfile, updateProfile, userlocate, uploadProfilePicture};