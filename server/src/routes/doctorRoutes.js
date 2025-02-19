const express = require('express');
const {getProfile,updateProfile,login,logout,register,search,uploadProfilePicture} = require('../controllers/doctorController.js');
const router=express.Router();
const {upload}=require('../constants/config.js');
const {isAuthenticated}=require('../middlewares/auth.js');
const {geoMiddleware}=require('../middlewares/geo.js');


router.post('/register',register);
router.post('/login',login);

router.use(isAuthenticated);

router.get('/logout',logout); 
router.get('/getprofile',getProfile);
router.put('/updateprofile', updateProfile);
router.put('/uploadpfp', upload.single('profilePicture'), uploadProfilePicture);

router.get('/search',geoMiddleware,search);






module.exports=router;