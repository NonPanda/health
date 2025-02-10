const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel.js');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const {register, login, getProfile ,updateProfile,logout,userlocate,sendEmail}=require('../controllers/usercontroller.js');
const { appendFile } = require('fs');
const {isAuthenticated}=require('../middlewares/auth.js');
const router = express.Router();

  router.post('/register',register);
  router.post('/login',login);
  
  router.use(isAuthenticated);

  router.get('/logout',logout); 
  router.get("/getprofile",getProfile);
  router.put("/updateprofile",updateProfile);
  router.get('/update-location',userlocate);



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
    console.error(err); 
    res.status(500).json({ Status: "An error occurred on the server" });
  }
});





module.exports = router;