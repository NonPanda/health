const axios = require('axios');
const User = require('../models/userModel.js');
const {ErrorHandler, TryCatch}= require('../constants/config.js');

 const getcoordinates= async (ip) => {
        try {
          const response = await axios.get(
            `https://api.ip2location.io/?key=${process.env.IP2LOCATION_KEY}&ip=${ip}`
          );
          
          return {
            type: "Point",
            coordinates: [response.data.longitude, response.data.latitude],
            city: response.data.city_name,
            state: response.data.region_name,
            zipcode: response.data.zip_code,
            formattedAddress: `${response.data.city_name}, ${response.data.region_name}`
          };
        } catch (error) {
          throw new ErrorHandler("Location service unavailable", 503);
        }
    };

  

module.exports={getcoordinates};
