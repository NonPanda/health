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
      specialities: [String],
      // role: {type: String, default: 'doctor'},
      qualifications: [String],
      experience: Number,
      availableSlots: [{
        date: Date,
        times: [String],
      }],
      },
    //   location: {
    //     type: { type: String, enum: ["Point"], required: true, default: "Point" },
    //     coordinates: { type: [Number], required: true, default: [0, 0] },
    //     formattedAddress: { type: String, default: "Unknown" }
    // },
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