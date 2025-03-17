const Doctor = require('../models/doctorModel.js');
const {TryCatch, ErrorHandler,cookieOptions,sendToken}=require('../constants/config.js');
const { compare } = require('bcrypt');
const {GoogleGenerativeAI}= require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


const search = TryCatch(async(req, res, next) => {
    const {search} = req.query;
    if(!search) return next(new ErrorHandler("Search Something", 400));

    const maxDistance = req.query.maxDistance || 999999999999;
    const review = req.query.minReviewRating || 0;
    console.log(req.query.specialization);
    const specializationfilter = req.query.specialization || "All";

    const model = genAI.getGenerativeModel({model:'gemini-1.5-flash'});
    const prompt = `Convert to medical specializations: ${search}. Respond with ONLY comma-separated specialists (ending with ist such as dentist, cardiologist, neurologist, etc). Include 'General Physician' if generic or vague. Do not include any explanations, newlines, or other text. Also write it in the order of importance`;

    const result = await model.generateContent(prompt);
    const specialization = (await result.response.text()).replace(/\n/g, ',').split(',').map(data => data.trim().toLowerCase());
    console.log("specialization", specialization);
    
    
    if (!req.searchLocation || !req.searchLocation.coordinates) {
        return next(new ErrorHandler("Location coordinates not available", 400));
    }

    console.log("search and max dist", search, maxDistance);
    const specializationPriority = {};
    specialization.forEach((s, i) => {
        specializationPriority[s] = i+1;
    });

    let specializationMatch;
    
    if (specializationfilter === "default") {
        specializationMatch = {}; 
    } else if (specializationfilter === "All") {
        specializationMatch = {
            "profile.specialization": { $exists: true }
        };
    } else {
        specializationMatch = {
            "profile.specialization": { $in: [new RegExp(`^${specializationfilter}$`, "i")] }
        };
        
    }
    const matchQuery = {
        $and: [
            specializationfilter !== "default" ? {
                "profile.specialization": {
                    $elemMatch: {
                        $in: specialization.map(s => new RegExp(`^${s}$`, "i"))
                    }
                }
            } : {},
            specializationMatch,
            { "rating": { $gte: Number(review) } }
        ].filter(condition => Object.keys(condition).length > 0) 
    };

    const doctors = await Doctor.aggregate([
        {
            $geoNear: {
                near: {
                    type: "Point",
                    coordinates: req.searchLocation.coordinates
                },
                distanceField: 'distance',
                maxDistance: Number(maxDistance),
                spherical: true
            }
        },
        {
            $match: matchQuery
        },
        {
            $sort: {
                rating: -1 
            }
        }
    ]);

    if (specializationfilter!=="default"&&doctors.length>0){
        doctors.sort((a,b)=>{
            const a1=Math.min(...a.profile.specialization
                .map(spec=>{
                    const matchingSpec=Object.keys(specializationPriority).find(
                        s=>new RegExp(`^${s}$`,"i").test(spec)
                    );
                    return matchingSpec?specializationPriority[matchingSpec]:999;
                }));
            
            const b1=Math.min(...b.profile.specialization
                .map(spec=>{
                    const matchingSpec=Object.keys(specializationPriority).find(
                        s=>new RegExp(`^${s}$`,"i").test(spec)
                    );
                    return matchingSpec?specializationPriority[matchingSpec]:999;
                }));
            
            if (a1!==b1){
                return a1-b1; 
            }
            
            return b.rating-a.rating; 
        });
    }

    res.status(200).json({
        success: true,
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

const getDoctorInfo = TryCatch(async (req, res, next) => {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return next(new ErrorHandler("User not found", 404));

    const doctorData = {
        name: doctor.name || "Unknown",
        specialization: doctor.profile.specialization || [],
        rating: doctor.rating || 0,
        totalReviews: doctor.totalReviews || 0,
        about: doctor.profile.about || "No information available",
        experience: doctor.profile.experience || 0,
        totalPatients: doctor.profile.totalPatients || 0,
        languages: doctor.profile.languages || [],
        education: doctor.profile.education || [],
        location: doctor.location.formattedAddress|| { formattedAddress: "Unknown" },
        phone: doctor.profile.phone || "Not available",
        email: doctor.email || "Not available",
        fees: doctor.profile.fees || 0,
        isVerified: doctor.profile.isVerified || false,
        avatar: doctor.profile.avatar || null,
    };

    res.status(200).json({
        success: true,
        doctor: doctorData,
    });
}
);


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












module.exports = { updateProfile, getProfile, register, login, logout,search,uploadProfilePicture, getDoctorInfo };