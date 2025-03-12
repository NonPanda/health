const Doctor = require('../models/doctorModel.js');
const {TryCatch, ErrorHandler,cookieOptions,sendToken}=require('../constants/config.js');
const { compare } = require('bcrypt');
const {GoogleGenerativeAI}= require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// main thing

const search= TryCatch(async(req,res,next)=>{
    const {search}= req.query;
    if(!search) return next (new ErrorHandler("Search Something", 400));

    const maxDistance=req.query.maxDistance || 50000;
    const review= req.query.minReviewRating || 0;

    const model=genAI.getGenerativeModel({model:'gemini-1.5-flash'});
    const prompt= `Convert to medical specializations:${search}.You must respond with comma-separated specializations. Include 'General Physician' if generic .`
    const result=await model.generateContent(prompt);
    const specialization= (await result.response.text()).split(',').map(data=>data.trim().toLowerCase());
    if (!req.searchLocation || !req.searchLocation.coordinates) {
        return next(new ErrorHandler("Location coordinates not available", 400));
    }

    console.log("search and max dist", search,maxDistance);
    const doctors=await Doctor.aggregate([
        {
            $geoNear:{
                near:{
                    type:"Point",
                    coordinates:req.searchLocation.coordinates
                },
                distanceField:'distance',
                maxDistance: Number(maxDistance),
                spherical:true
            }
        },
        {
            $match:{
                "profile.specialization": {$elemMatch: { $in: specialization.map(s => new RegExp(`^${s}$`, "i")) }
            },
            "rating":{$gte:Number(review)
}
            }

        },
        
    ]);
    
    res.status(200).json({
        success:true,
        location: req.searchLocation,
        count: doctors.length,
        data: doctors,
    });
});

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
    const duplicate= await Doctor.findOne({email});
    if(duplicate) return next(new ErrorHandler("User already exists", 400));
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

const uploadProfilePicture = TryCatch(async (req, res, next) => {
  const { userId } = req.body;
  if (!userId) {
    return next(new ErrorHandler("User ID is required", 400));
  }
  if (!req.file) {
    return next(new ErrorHandler("No file uploaded", 400));
  }
  const user = await Doctor.findById(userId);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  const file = req.file.buffer.toString("base64");
  user.profile.avatar = `data:${req.file.mimetype};base64,${file}`;
  await user.save();

  res.status(200).json({ success: true, user });
});












module.exports = { updateProfile, getProfile, register, login, logout,search,uploadProfilePicture };