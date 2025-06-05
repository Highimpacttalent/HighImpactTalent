// Updated version of your auth middleware
import JWT from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  const authHeader = req?.headers?.authorization;

  // Check if authorization header exists and starts with Bearer
  if (!authHeader || !authHeader?.startsWith("Bearer")) {
    return res.status(401).json({
      success: false,
      msg: "Authentication failed - No token provided"
    });
  }

  const token = authHeader?.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({
      success: false,
      msg: "Token is missing"
    });
  }

  try {
    const userToken = JWT.verify(token, process.env.JWT_SECRET_KEY);

    req.body.user = {
      userId: userToken.userId,
    };
    next();
  } catch (error) {
    console.log(error);
    
    // Check if token is expired
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        msg: "Token expired - Please login again",
        code: "TOKEN_EXPIRED"
      });
    }
    
    // Handle other JWT errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        msg: "Invalid token",
        code: "INVALID_TOKEN"
      });
    }
    
    // Generic authentication failure
    return res.status(401).json({
      success: false,
      msg: "Authentication failed",
      code: "AUTH_FAILED"
    });
  }
};

export default userAuth;