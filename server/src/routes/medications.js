const express = require('express');
const router = express.Router();
const Medication = require('../models/medicationModel.js');
const { isAuthenticated } = require('../middlewares/auth'); // assumed authentication middleware

// GET all medications for logged-in user
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const medications = await Medication.find({ user: req.user }).sort({ createdAt: -1 });
    res.json({ success: true, medications });
  } catch (error) {
    console.error('Error fetching medications:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET a single medication by ID
router.get('/:id', isAuthenticated, async (req, res) => {
  try {
    const medication = await Medication.findOne({ _id: req.params.id, user: req.user });
    if (!medication) {
      return res.status(404).json({ success: false, error: 'Medication not found' });
    }
    res.json({ success: true, medication });
  } catch (error) {
    console.error('Error fetching medication:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST create a new medication
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { name, dosage, frequency, time, instructions, refillDate, doctor, purpose, color, category } = req.body;
    if (!name || !dosage) {
      return res.status(400).json({ success: false, error: 'Medication name and dosage are required' });
    }
    const medication = new Medication({
      user: req.user,
      name,
      dosage,
      frequency,
      time,
      instructions,
      refillDate: refillDate ? new Date(refillDate) : null,
      doctor,
      purpose,
      color: color || "#4F46E5",
      category
    });
    await medication.save();
    res.status(201).json({ success: true, medication });
  } catch (error) {
    console.error('Error creating medication:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT update a medication
router.put('/:id', isAuthenticated, async (req, res) => {
  try {
    const medication = await Medication.findOne({ _id: req.params.id, user: req.user });
    if (!medication) {
      return res.status(404).json({ success: false, error: 'Medication not found' });
    }
    const { name, dosage, frequency, time, instructions, refillDate, doctor, purpose, color, category, taken, adherence } = req.body;
    if(name) medication.name = name;
    if(dosage) medication.dosage = dosage;
    if(frequency) medication.frequency = frequency;
    if(time) medication.time = time;
    if(instructions) medication.instructions = instructions;
    if(refillDate) medication.refillDate = new Date(refillDate);
    if(doctor) medication.doctor = doctor;
    if(purpose) medication.purpose = purpose;
    if(color) medication.color = color;
    if(category) medication.category = category;
    if (taken !== undefined) medication.taken = taken;
    if (adherence !== undefined) medication.adherence = adherence;
    await medication.save();
    res.json({ success: true, medication });
  } catch (error) {
    console.error('Error updating medication:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE a medication
router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    const medication = await Medication.findOneAndDelete({ _id: req.params.id, user: req.user });
    if (!medication) {
      return res.status(404).json({ success: false, error: 'Medication not found' });
    }
    res.json({ success: true, message: 'Medication deleted', medication });
  } catch (error) {
    console.error('Error deleting medication:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;