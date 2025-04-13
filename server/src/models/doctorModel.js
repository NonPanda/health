const mongoose=require('mongoose');
const {hash}=require('bcrypt');
const User = require('./userModel.js');

const doctorSchema = new mongoose.Schema({
      name: {
        type: String,
        required: true,
        trim: true
      },
      email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
      },
      password: {
        type: String,
        required: true,
        minlength: 6
      },
      profile:{
      avatar: String,
      phone: String,
      fees: Number,
      education: [{
        degree: String,
        institution: String,
        year: String,
        duration: String,
      }],
      certifications: [String],
      specialization: [String],
      experience: Number,
      workingHours: String,
      about: String,
      availability:[{
        day: { type: String, enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] },
        hours: String,
      }],
      consultDuration:{
        type:Number,
        default:30,
      },
      languages:[String],
     
    },
      isVerified: {
        type: Boolean,
        default: false
      },
      totalPatients: {
        type: Number,
        default: 0
      },
     

    location: {
    type: { 
        type: String, 
        enum: ["Point"], 
        required: true, 
        default: "Point" 
    },
    coordinates: { 
        type: [Number], 
        required: true,
        validate: {
            validator: function(v) {
                return v.length === 2 && 
                       v[0] >= -180 && v[0] <= 180 &&
                       v[1] >= -90 && v[1] <= 90;
            },
            message: "Invalid coordinates"
        }
    },
    formattedAddress: String
},
      rating: { type: Number, default: 0 },
      reviews: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        review: String
      }],
},
{
    timestamps: true
});

doctorSchema.index({ "location": "2dsphere" });

doctorSchema.pre("save", async function(next) {
   
  if(!this.isModified("password")) return next();
  this.password = await hash(this.password, 10);

});

module.exports = mongoose.model('Doctor', doctorSchema);