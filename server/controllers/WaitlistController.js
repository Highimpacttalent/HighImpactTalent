import WaitlistUser from "../models/Waitlist.js";
import validator from 'validator';
import CountTracker from "../models/Count.js";

export const addToWaitlist = async (req, res) => {
  const { email } = req.body;

  if (!email || !validator.isEmail(email)) {
    return res.status(400).json({ success: false, message: "Invalid email" });
  }

  try {
    const exists = await WaitlistUser.findOne({ email });
    if (exists) {
      return res.status(409).json({ success: false, message: "Email already on waitlist" });
    }

    const newUser = await WaitlistUser.create({ email });
    res.status(201).json({ success: true, message: "Successfully added to waitlist", user: newUser });
  } catch (error) {
    console.error("Waitlist Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//Return Count
export const getCurrentSignupCount = async (req, res) => {
  try {
    // Count how many documents exist in countTracker collection
    const currentCount = await CountTracker.countDocuments();

    res.status(200).json({
      success: true,
      count: currentCount,
      message: `Current signup count is ${currentCount}`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch signup count",
    });
  }
};
