// const TOEKN= "token";
const jwt = require('jsonwebtoken');

const cookieOptions = {
    maxAge: 15 * 24 * 60 * 60 * 1000,
    sameSite: "lax",
    secure: true,
    httpOnly: false,
};

const sendToken = (res, user, code, message) => {
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    
    return res
        .status(code)
        .cookie("token", token, cookieOptions)
        .json({
            success: true,
            // token,
            user,
            message,
        });
};
class ErrorHandler extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
    }
  }

const TryCatch=(passedFunc)=> async (req,res,next) => {
    try {
        await passedFunc(req,res,next);
    } catch (error) {
        next(error);
    }
};
module.exports={ cookieOptions,sendToken,TryCatch,ErrorHandler};