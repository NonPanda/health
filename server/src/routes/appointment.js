const express = require('express');
const router = express.Router();
const Appointment = require('../models/appointmentModel');
const { isAuthenticated } = require('../middlewares/auth');

// Book an appointment
router.post('/book', isAuthenticated, async (req, res) => {
  try {
    console.log('Received data:', req.body);
    const { user, doctor, appointmentDate, appointmentTime } = req.body;
    const appointment = await Appointment.create({
      doctor,
      user,
      appointmentDate: new Date(appointmentDate),
      appointmentTime
    });
    res.status(201).json({ success: true, appointment });
  } catch (error) {
    console.error('Error in booking appointment:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all appointments for the logged-in user (for patients)
router.get('/', isAuthenticated, async (req, res) => {
  try {
    // req.user._id should match the user field in Appointment
    const appointments = await Appointment.find({ user: req.user })
      .populate('doctor')
      .sort({ appointmentDate: 1 });
    res.json({ success: true, appointments });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// For a doctor to view their appointments
router.get('/doctor', isAuthenticated, async (req, res) => {
  try {
    // req.user._id should match the doctor field in Appointment
    const appointments = await Appointment.find({ doctor: req.user })
      .populate('user')
      .sort({ appointmentDate: 1 });
    res.json({ success: true, appointments });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Approve (update) an appointment – accessible by doctor only
router.put('/:id/approve', isAuthenticated, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, error: 'Appointment not found' });
    }
    // Check if the logged-in doctor is the one assigned to the appointment
    if (appointment.doctor.toString() !== req.user.toString()) {
      return res.status(403).json({ success: false, error: 'Not authorized to approve this appointment' });
    }
    // Update the status to 'confirmed'
    appointment.status = 'confirmed';
    await appointment.save();
    res.json({ success: true, appointment });
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;