const express = require('express');
const {getProfile,updateProfile}= require('../controllers/doctorController.js');
const router=express.Router();
const {isAuthenticated}=require('../middlewares/auth.js');

router.use(isAuthenticated);
router.get('/getprofile',getProfile);
router.put('/updateprofile', updateProfile);

module.exports=router;