const jwt = require("jsonwebtoken");
const CHAT_TOKEN = "token";
const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies[CHAT_TOKEN];
        if (!token) {
            return next(new Error("Please login to access this route"));
        }
        const decodedData = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodedData._id;
        // console.log("User ID:", req.user);
        next();
    } catch (error) {
        next(error);
    }
};
module.exports = { isAuthenticated };