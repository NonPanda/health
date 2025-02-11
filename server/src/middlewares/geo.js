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



const getcity = async (city) => {
    console.log("Fetching city coordinates for:", city);

    const response=await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(city)}&key=${process.env.OPENCAGE_KEY}`);

    console.log("OpenCage Response:", response.data); 

    if (!response.data || !response.data.results || response.data.results.length === 0) {
        console.error("No results found for city:", city);
        throw new Error(`No location data found for "${city}"`);
    }

    // Extract the first result's coordinates correctly
    const locationData = response.data.results[0].geometry;
    
    if (!locationData || locationData.lat === undefined || locationData.lng === undefined) {
        console.error("Invalid geometry data:", locationData);
        throw new Error("Invalid location data received from OpenCage");
    }
    console.log("City coordinates received:", locationData.lng, locationData.lat);
    return {
        type: "Point",
        coordinates: [locationData.lng, locationData.lat],
    }
    
};
  
  const getcoordinates = async (ip) => {
      if (ip === "127.0.0.1" || ip === "::1") {
        ip = await getPublicIP();
         console.log("Using external IP:", ip);
      }

      const response = await axios.get(
            `https://api.ip2location.io/?key=${process.env.IP2LOCATION_KEY}&ip=${ip}`
            );
            console.log("IP2Location Response:", response.data);
      if (!response.data.latitude || !response.data.longitude) {
        throw new Error("Invalid location data");
      }
      console.log("User coordinates:", response.data.longitude, response.data.latitude);
  
      return {
        type: "Point",
        coordinates: [response.data.longitude, response.data.latitude],
        // formattedAddress: `${response.data.city_name}, ${response.data.region_name}`,
      };
      
    };
   
    
const geoMiddleware = TryCatch(async (req, res, next) => {
    try{
    if (req.query.city) {
        req.searchLocation = await getcity(req.query.city);
        console.log("City coordinates:", req.searchLocation);
    } else {
        const ip = req.headers["x-forwarded-for"] || req.ip;
        console.log("Fetching coordinates for IP:", ip);
        if (!ip) {
            throw new ErrorHandler("No IP address detected", 400);
        }
        req.searchLocation = await getcoordinates(ip);
        console.log("IP coordinates received:", req.searchLocation);
    }

    if (!req.searchLocation?.coordinates || 
        !Array.isArray(req.searchLocation.coordinates) ||
        req.searchLocation.coordinates.length !== 2) {
        console.error("Invalid location data:", req.searchLocation);
        throw new ErrorHandler("Failed to get valid location coordinates", 500);
    }

    // req.searchLocation = location;
    console.log("Search location set:", req.searchLocation);
    next();
} catch (error) {
    next(error);
}    
});




module.exports={geoMiddleware};
