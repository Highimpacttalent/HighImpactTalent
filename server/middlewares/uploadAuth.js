import JWT from "jsonwebtoken";

export const uploadAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Authorization header missing or invalid"
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = JWT.verify(token, process.env.JWT_SECRET_KEY);
    req.uploaderId = decoded.userId; // Store in custom property
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
};