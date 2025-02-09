const express = require('express');
const {getProfile,updateProfile,login,logout,register,search} = require('../controllers/doctorController.js');
const router=express.Router();
const {isAuthenticated}=require('../middlewares/auth.js');
const {geoMiddleware}=require('../middlewares/geo.js');

router.post('/register',register);
router.post('/login',login);

router.use(isAuthenticated);

router.get('/logout',logout); 
router.get('/getprofile',getProfile);
router.put('/updateprofile', updateProfile);
router.get('/search',geoMiddleware,search);






module.exports=router;