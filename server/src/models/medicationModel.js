const mongoose = require('mongoose');

const MedicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: { type: String, required: true },
    dosage: { type: String, required: true },
    frequency: { type: String },
    time: { type: String },
    instructions: { type: String },
    refillDate: { type: Date },
    doctor: { type: String },
    purpose: { type: String },
    color: { type: String, default: "#4F46E5" },
    adherence: { type: Number, default: 100 },
    taken: { type: Boolean, default: false },
    category: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Medication', MedicationSchema);