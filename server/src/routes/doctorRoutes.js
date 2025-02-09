const express = require('express');
const {getProfile,updateProfile,login,logout,register} = require('../controllers/doctorController.js');
const router=express.Router();

router.post('/register',register);
router.post('/login',login);
router.get('/logout',logout); 
router.get('/getprofile',getProfile);
router.put('/updateprofile', updateProfile);


module.exports=router;