const express = require('express');
const {getDoctorProfile,updateDoctorProfile}= require('../controllers/doctorController.js');
const router=express.Router();

// router.post('/register',register);
// router.post('/login',login);
router.get('/getprofile',getDoctorProfile);
router.put('/updateprofile', updateDoctorProfile);

module.exports=router;