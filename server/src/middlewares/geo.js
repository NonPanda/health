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
  
  const getcoordinates = async (ip) => {
    try {
      if (ip === "127.0.0.1" || ip === "::1") {
        ip = await getPublicIP();
        console.log("Using external IP:", ip);
      }

      const response = await axios.get(
            `https://api.ip2location.io/?key=${process.env.IP2LOCATION_KEY}&ip=${ip}`
            );
  
      if (!response.data.latitude || !response.data.longitude) {
        throw (new ErrorHandler("Invalid location data", 500));
      }
  
      return {
        type: "Point",
        coordinates: [response.data.longitude, response.data.latitude],
        city: response.data.city_name,
        state: response.data.region_name,
        zipcode: response.data.zip_code,
        formattedAddress: `${response.data.city_name}, ${response.data.region_name}`,
      };
    } catch (error) {
      console.error("Error fetching location:", error);
      throw (new ErrorHandler("Location service unavailable",500));
    }
  };
  



  

module.exports={getcoordinates};
