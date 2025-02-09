const axios = require('axios');
const User = require('../models/userModel.js');
const {ErrorHandler, TryCatch}= require('../constants/config.js');

const getPublicIP = async () => {
    try {
      const response = await axios.get("https://checkip.amazonaws.com/");
      return response.data.trim();
    } catch (error) {
      console.error("Error fetching public IP:", error);
      return "127.0.0.1"; // Fallback if API fails
    }
  };

const getcity=TryCatch(async(city)=>{
    const response=await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(city)}&key=${process.env.OPENCAGE_KEY}`);
    console.log(response.data);
    if (response.data && response.data.results.length > 0) {
        const { lat, lng } = response.data.results[0].geometry; 
        return { type: "Point", coordinates: [lng, lat] };
      } else {
        throw new Error("No location data found");
      }
    // if(response.data.results.length===0){
    //     throw new ErrorHandler("Invalid city", 404);
    // }

    // return{
    //     type:"Point",
    //     coordinates:[response.data.results[0].geometry.lng,response.data.results[0].geometry.lat],
    //     // formattedAddress:response.data.results[0].formatted
    // };
});
  
  const getcoordinates = TryCatch(async (ip) => {
      if (ip === "127.0.0.1" || ip === "::1") {
        ip = await getPublicIP();
        // console.log("Using external IP:", ip);
      }

      const response = await axios.get(
            `https://api.ip2location.io/?key=${process.env.IP2LOCATION_KEY}&ip=${ip}`
            );
  
      if (!response.data.latitude || !response.data.longitude) {
        throw new ErrorHandler("Invalid location data", 500);
      }
  
      return {
        type: "Point",
        coordinates: [response.data.longitude, response.data.latitude],
        // formattedAddress: `${response.data.city_name}, ${response.data.region_name}`,
      };
    });

  const geoMiddleware = TryCatch(async(req,res,next)=>{
    if(req.query.city){
        const location=await getcity(req.query.city);
        req.searchLocation=location;
        console.log("User city coordinate:",req.searchLocation);
    }
    else{
        const ip=req.headers['x-forwarded-for'] || req.ip;
        // console.log("User IP detected:",ip);
        if(!ip){
            return next(new ErrorHandler("No IP address detected", 400));
        }
        const location=await getcoordinates(ip);

        req.searchLocation=location;
        // console.log("User ip coordinate:",location);
    }
        next();
    
    });
    

module.exports={geoMiddleware};
