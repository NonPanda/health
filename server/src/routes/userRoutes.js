const express = require('express');
const { register, login, editUser, sendEmail } = require('../user/auth.js'); // Adjust the path as necessary
const jwt = require('jsonwebtoken');
const User = require('../models/userModel.js'); // Adjust based on your user model
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const { validateUser } = require('../user/auth.js');
const router = express.Router();

const frontendUrl = process.env.FRONTEND_URL; 
//----------------------------------------------
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  const result = await register(name, email, password);
  res.status(result.status).json({ message: result.message, token: result.token });
});

//----------------------------------------------
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const result = await login(email, password);
  res.status(result.status).json({ message: result.message, token: result.token });
});

//----------------------------------------------
router.put('/edit/:userId', async (req, res) => {
  const { userId } = req.params;
  const updates = req.body; // Contains the fields to update
  const result = await editUser(userId, updates);
  res.status(result.status).json({ message: result.message });
});

//----------------------------------------------
router.post('/contactus', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const newContact = new Contact({ name, email, message });
    await newContact.save();
    res.status(201).send('Contact saved');
  } catch (error) {
    console.error('Error saving contact:', error);
    res.status(500).send('Error saving contact');
  }
});

//----------------------------------------------
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).send('User not found');
  }

  const resetToken = crypto.randomBytes(20).toString('hex');
  const hash = await bcrypt.hash(resetToken, 10);
  user.resetPasswordToken = hash;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  await user.save();

  const resetUrl = `${frontendUrl}/reset-password/${user._id}/${resetToken}`;
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2 style="color: #333;">Password Reset Request</h2>
      <p>Hi ${user.name},</p>
      <p>You requested to reset your password. Click the link below to reset it:</p>
      <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; margin: 10px 0; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">Reset Password</a>
      <p>If you did not request a password reset, please ignore this email.</p>
      <p>Thanks,<br/>The Doctor Who Team</p>
    </div>
  `;
  await sendEmail(user.email, 'Password Reset', htmlContent);

  res.send('Password reset email sent.');
});

//----------------------------------------------
router.post('/reset-password/:id/:token', async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Hash new password
    const hash = await bcrypt.hash(password, 10);

    // Update user password
    user.password = hash;
    user.resetPasswordToken = undefined; // Clear the reset token
    user.resetPasswordExpires = undefined; // Clear the token expiry
    await user.save();

    // Respond with success
    res.send({ Status: "Success" });
  } catch (err) {
    console.error(err); // Log the error for server-side debugging
    res.status(500).json({ Status: "An error occurred on the server" });
  }
});

//----------------------------------------------
router.get("/user", validateUser, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;