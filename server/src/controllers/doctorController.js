const Doctor = require('../models/doctorModel.js');
const {TryCatch, ErrorHandler,cookieOptions,sendToken}=require('../constants/config.js');
const { compare } = require('bcrypt');
const {GoogleGenerativeAI}= require('@google/generative-ai');
// const { model } = require('mongoose');
// const {userlocate}=require('../controllers/usercontroller.js');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// main shit

const search= TryCatch(async(req,res,next)=>{
    const {search}= req.query;
    if(!search) return next (new ErrorHandler("Search Something", 400));

    const maxDistance=req.query.maxDistance || 50000;

    const model=genAI.getGenerativeModel({model:'gemini-1.5-flash'});
    const prompt= `Convert to medical specialities:${search}.You must respond with commq-separated specialities. Include 'General Physician' if generic .`
    const result=await model.generateContent(prompt);
    const specialities= (await result.response.text()).split(',').map(data=>data.trim().toLowerCase());
    console.log("specialities",specialities);
    if (!req.searchLocation || !req.searchLocation.coordinates) {
        return next(new ErrorHandler("Location coordinates not available", 400));
    }

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
                specialities:{ $in: specialities}
            }
        },
        {
            $project:{
                _id:1,
                name:1,
                specialities:1,
                distance:1,
                rating:1,
                experience:1,
                fees:1,
                formattedAddress:`$location.formattedAddress`,
        }
    }
    ]);
console.log("doctor",doctors);

    // const resultDoctor=[];
    // if(doctors.length>0){
    //     resultDoctor= [doctors[0], ...doctors.slice(1)];
    // }
    
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













module.exports = { updateProfile, getProfile, register, login, logout,search};