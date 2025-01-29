const mongoose = require('mongoose');

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
  phone: {
    type: String,
    trim: true,
    required: false
  },
  weight: {
    type: Number,
    required: false
  },
  height: {
    type: Number,
    required: false
  },
  age: {
    type: Number,
    required: false
  },
  allergies: {
    type: [String],  
    required: false
  },
  emergencyContact: {
    type: String,
    required: false
  },
  medications: {
    type: [String], 
    required: false
  },
  diet: {
    type: [String], 
    required: false
  },
  location: {
    type: String,
    required: false
  },
  pfp: {
    type: String, 
    required: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
