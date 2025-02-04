const mongoose = require('mongoose');
const { hash } = require('bcrypt');

const userSchema = new mongoose.Schema({
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
  role: { type: String, enum: ['user', 'doctor', 'admin'], default: 'user' },
  profile: {
    avatar: String,
    height: Number,
    weight: Number,
    age: Number,
    medications: [String],
    contact: String,
    allergies: [String],
    dietPreference: [String],
    location: {
      type: { type: String,default: "Point", enum: ["Point"] },
      coordinates: [Number],
      formattedAddress: String,
      city: String,
      state: String,
      zipcode: String
    }
  }
}, {
  timestamps: true
});

userSchema.pre("save", async function(next) {
   
  if(!this.isModified("password")) return next();
  this.password = await hash(this.password, 10);

});


// Create a 2dsphere index on the location field for geospatial queries
userSchema.index({ "profile.location": "2dsphere" });

module.exports = mongoose.model('User', userSchema);
