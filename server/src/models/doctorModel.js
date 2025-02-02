const mongoose=require('mongoose');
const {hash}=require('bcrypt');
const User = require('./userModel.js');

const doctorSchema = new mongoose.Schema({
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      specialty: { type: String, required: true },
      role: {type: String, default: 'doctor'},
      qualifications: [String],
      experience: Number,
      availableSlots: [{
        date: Date,
        times: [String]
      }],
      rating: { type: Number, default: 0 },
      reviews: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        review: String
      }],
      profile:{
        avatar: String,
        phone: String,
        online: Boolean,
        fees: Number,
        location: {
          type: { type: String, default: 'Point' },
          coordinates: [Number]
        },
      }
},
{
    timestamps: true
});

doctorSchema.pre("save", async function(next) {
   
  if(!this.isModified("password")) return next();
  this.password = await hash(this.password, 10);

});

module.exports = mongoose.model('Doctor', doctorSchema);