const mongoose=require('mongoose');
const {hash}=require('bcrypt');

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
      phone: {
        type: String,
        trim: true,
        required: false
      },
        speciality: {
            type: String,
            required: false
        },
        workingHours:{
            type: String,
            required: false
        },
        education:{
            type: String,
            required: false
        },
        location: {
            type: String,
            required: false
        },
        experince:{
            type: Number,
            required: false
        },
        certifications: {
            type: [String],
            required: false
        },
        online:{
            type: Boolean,
            required: false
        },
        fees:{
            type: Number,
            required: false
        },
        pfp: {
            type: String,
            required: false
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