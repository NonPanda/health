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
      speciality: { type: String },
      // role: {type: String, default: 'doctor'},
      qualifications: [String],
      experience: Number,
      availableSlots: [{
        date: Date,
        times: [String],
      }],
      location: {
        type: { type: String, default: 'Point' },
        coordinates: [Number],
        formattedAddress: String,
        city: String,
        state: String,
        zipcode: String
      }},
      rating: { type: Number, default: 0 },
      reviews: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        review: String
      }],
},
{
    timestamps: true
});

doctorSchema.pre("save", async function(next) {
   
  if(!this.isModified("password")) return next();
  this.password = await hash(this.password, 10);

});

module.exports = mongoose.model('Doctor', doctorSchema);