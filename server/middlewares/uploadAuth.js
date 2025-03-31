import JWT from "jsonwebtoken";
import Users from "../models/userModel.js";

const uploadAuth = async (req, res, next) => {
  const authHeader = req?.headers?.authorization;
  
  if (!authHeader || !authHeader?.startsWith("Bearer")) {
    return res.status(401).json({
      success: false,
      message: "Authorization header missing or invalid"
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = JWT.verify(token, process.env.JWT_SECRET_KEY);
    const user = await Users.findById(decoded.userId).select("-password");
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found"
      });
    }
    req.user = user;
    req.body.user = { userId: user._id.toString() };
    
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({
      success: false,
      message: "Authentication failed",
      error: error.message
    });
  }
};

export default uploadAuth;