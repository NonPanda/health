const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel'); // Adjust the path as necessary
const nodemailer = require('nodemailer');
require('dotenv').config();

/*********************************************************
                      Register
*********************************************************/
const register = async (name, email, password ) => {
    try {
      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) return { message: "User already exists", status: 403 };
  
      // Hash the password before saving it to the database
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Create a new user object
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
      });
  
      // Save the new user to the database
      await newUser.save();
  
      // Generate a token for the new user
      const token = jwt.sign({ userId: newUser._id },process.env.JWT_SECRET);

      // Return success message and token
      return { 
        message: "User created successfully", 
        token: token,
        status: 200
      };
    } catch (error) {
      console.error("Error in user registration:", error);
      return { message: "Error registering user", status: 500 };
    }
  };


/*********************************************************
                      Login
*********************************************************/
const login = async (email, password) => {
  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) return { message: "User not found", status: 404 };

    // Check if the password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return { message: "Invalid credentials", status: 401 };

    const isAdmin = user.role === 1;
    // Generate a token for the user
    const token = jwt.sign({ userId: user._id, isAdmin:isAdmin}, process.env.JWT_SECRET);

    // console.log('isAdmin:', isAdmin);
    // Return success message and token
    return {
      isAdmin:true,
      message: "Logged in successfully",
      token: token,
      status: 200
    };
  } catch (error) {
    console.error("Error in user login:", error);
    return { message: "Error logging in user", status: 500 };
  }
};


/*********************************************************
                      editUser
*********************************************************/
const editUser = async (userId, updates) => {
  try {
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) return { message: "User not found", status: 404 };

    // Update fields if they exist in updates object
    if (updates.name) user.name = updates.name;
    if (updates.email) user.email = updates.email;
    if (updates.password) {
      // Hash the new password before saving
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(updates.password, salt);
    }

    // Save the updated user
    await user.save();

    // Return success message
    return {
      message: "User updated successfully",
      status: 200
    };
  } catch (error) {
    console.error("Error in updating user:", error);
    return { message: "Error updating user", status: 500 };
  }
};

/*********************************************************
                      Forgot Password
*********************************************************/
async function sendEmail(to, subject, html) {
  // Create a transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Health" <$process.env.EMAIL_USER>', // sender address
    to: to, // list of receivers
    subject: subject, // Subject line',
    html: html,
  });

  // console.log('Message sent: %s', info.messageId);
}

/*********************************************************
                      Validate User
*********************************************************/
const validateUser = async (req, res, next) => {
  try {
    // console.log('req.headers:', req.headers)
    // Check for the Authorization header
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ error: "Authorization header missing" });
    }
    // console.log('authHeader:', authHeader)
    // Extract the token from the Authorization header
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Token missing" });
    }

    // console.log('token:', token)
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { userId, isAdmin } = decoded;

    // console.log('decoded:', decoded)
    // Check if the user exists in the database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }


    // Attach user and admin info to the request object
    req.user = user;
    req.isAdmin = user.role === 1;
    req.canUpload = user.canUpload;

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token" });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired" });
    }
    res.status(500).json({ error: error.message });
  }
};

/*********************************************************
                      Validate admin
*********************************************************/
const validateAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ error: "Authorization header missing" });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user || user.role !== 1) {
      return res.status(403).json({ error: "Access denied" });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Profile Picture 


module.exports = { register, login, editUser, sendEmail, validateUser, validateAdmin };