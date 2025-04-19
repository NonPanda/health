const express = require('express');
const User = require('../models/userModel.js');
const {upload} = require('../constants/config.js');
const {register, login, getProfile ,updateProfile,logout,userlocate,uploadProfilePicture,reset,forgot} =require('../controllers/usercontroller.js');
const {isAuthenticated}=require('../middlewares/auth.js');
const router = express.Router();

  router.post('/register',register);
  router.post('/login',login);
  router.post('/forgot-password',forgot);
  router.post('/reset-password/:id/:token',reset);
  
  router.use(isAuthenticated);

  router.get('/logout',logout); 
  router.get("/getprofile",getProfile);
  router.put("/updateprofile",updateProfile);
  router.put('/uploadpfp', upload.single('profilePicture'), uploadProfilePicture);

  router.get('/update-location',userlocate);
  

module.exports = router;