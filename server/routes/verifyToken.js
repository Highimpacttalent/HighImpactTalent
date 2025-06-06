import express from "express";
import userAuth from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @route   GET /api-v1/auth/verify-token
 * @desc    Verify that the JWT is still valid
 * @access  Protected (needs Bearer token)
 */
router.get("/verify-token", userAuth, (req, res) => {
  return res.status(200).json({
    success: true,
    msg: "Token is valid",
    user: req.body.user   // { userId: ... }
  }); 
});

export default router;
