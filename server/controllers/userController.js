import mongoose from "mongoose";
import Users from "../models/userModel.js";
import { application } from "express";
import Application from "../models/ApplicationModel.js";
import bcrypt from "bcryptjs";

// upload resume
export const uploadResume = async (req, res) => {
  try {
    const { url } = req.body;
    // console.log(url)
    const userResume = await Users.findOneAndUpdate(
      { _id: req.body.user.userId },
      { cvUrl: url }
    );
    if (!userResume) {
      return res.status(404).json({
        success: false,
        message: "Problem while uploding resume",
      });
    }
    res.status(200).json({
      success: true,
      message: "resume updated",
      user: userResume,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      success: false,
    });
  }
};
// update user details
export const updateUser = async (req, res, next) => {
  console.log("updateUser function called"); // Log statement to verify function call
  console.log("Request body:", req.body);
  const {
    job,
    company,
    currentCompany,
    currentDesignation,
    linkedinLink,
    experience,
    about,
    contactNumber,
    profilePic,
    resume,
    salary,
    location,
    relocate,
    joinConsulting,
    dateOfBirth,
  } = req.body;

  try {
    // if (!about || !experience) {
    //   next("Please provide all required fields");
    // }
    const id = req.body.user.userId;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).send(`No User with id: ${id}`);
    }

    const updateUser = {
      contactNumber,
      profileUrl: profilePic,
      cvUrl: resume,
      currentJobRole: job,
      currentSalary: salary,
      currentConsultingCompany: company,
      currentCompany,
      currentDesignation,
      linkedinLink,
      currentLocation: location,
      openToRelocate: relocate,
      joinConsulting,
      dateOfBirth,
      about,
      experience,
    };

    const user = await Users.findByIdAndUpdate(id, updateUser, { new: true });

    const token = user.createJWT();

    user.password = undefined;

    res.status(200).json({
      sucess: true,
      message: "User updated successfully",
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

// get user using token
export const getUser = async (req, res, next) => {
  try {
    const id = req.body.user.userId;
    console.log(id);
    const user = await Users.findById({ _id: id });

    if (!user) {
      return res.status(200).send({
        message: "User Not Found",
        success: false,
      });
    }

    user.password = undefined;

    res.status(200).json({
      success: true,
      user: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "auth error",
      success: false,
      error: error.message,
    });
  }
};

export const getUsers = async (req, res) => {
  try {
    // const id = req.body.user.userId;
    // console.log(id)
    const users = await Users.find({});

    if (!users) {
      return res.status(200).send({
        message: "Users Not Found",
        success: false,
      });
    }

    // user.password = undefined;

    res.status(200).json({
      success: true,
      users: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "auth error",
      success: false,
      error: error.message,
    });
  }
};

// register user
export const register = async (req, res, next) => {
  // const { firstName, lastName, email, password }
  // {
  //   accountType,contactNumber,profileUrl,cvUrl,currentJobRole,currentSalary,currentCompany,currentLocation,openToRelocate,joinConsulting,about,experience,skills,appliedJobs}
  const { firstName, lastName, email, password } = req.body;
  //validate fileds

  if (!firstName) {
    next("First Name is required");
  }
  if (!email) {
    next("Email is required");
  }
  if (!lastName) {
    next("Last Name is required");
  }
  if (!password) {
    next("Password is required");
  }

  try {
    const userExist = await Users.findOne({ email });

    if (userExist) {
      next("Email Address already exists");
      return;
    }

    const user = await Users.create({
      firstName,
      lastName,
      email,
      password,
    });

    // user token
    const token = await user.createJWT();
    user.password = null;
    res.status(201).send({
      success: true,
      message: "Account created successfully",
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

// login user
export const signIn = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    //validation
    if (!email || !password) {
      next("Please Provide AUser Credentials");
      return;
    }

    // find user by email
    const user = await Users.findOne({ email }).select("+password");

    if (!user) {
      next("Invalid -email or password");
      return;
    }

    // compare password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "wrong password",
      });
    }

    user.password = undefined;

    const token = user.createJWT();

    res.status(202).json({
      success: true,
      message: "Login successfully",
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

// delete user account  and delete all application he/she applied
export const deleteUser = async (req, res, next) => {
  try {
    const id = req.body.user.userId;
    console.log(id);
    const user = await Users.findById({ _id: id });

    if (!user) {
      return res.status(200).send({
        message: "User Not Found",
        success: false,
      });
    }
    // user application

    const userApplication = await Application.deleteMany({ applicant: id });

    const deleteUser = await Users.findByIdAndDelete({ _id: id });

    res.status(200).json({
      success: true,
      deletedUser: deleteUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error while deleting",
      success: false,
      error: error.message,
    });
  }
};

export const toggleJobLike = async (req, res) => {
  try {
    const userId = req.body?.user?.userId;
    const { jobId } = req.body;

    console.log("Received userId:", userId);
    console.log("Received jobId:", jobId);

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "Invalid userId" });
    }

    if (!jobId || !mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ success: false, message: "Invalid jobId" });
    }

    // Find the user by ID
    const user = await Users.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Ensure jobId is properly compared
    const jobIndex = user.likedJobs.findIndex((job) => job.toString() === jobId);

    if (jobIndex > -1) {
      // Remove from liked jobs
      user.likedJobs.splice(jobIndex, 1);
      await user.save();
      return res.status(200).json({
        success: true,
        message: "Job removed from liked jobs",
        likedJobs: user.likedJobs,
        user
      });
    } else {
      // Add jobId as ObjectId
      user.likedJobs.push(new mongoose.Types.ObjectId(jobId));
      await user.save();
      return res.status(200).json({
        success: true,
        message: "Job added to liked jobs",
        likedJobs: user.likedJobs,
        user
      });
    }
  } catch (error) {
    console.error("Error in toggleJobLike:", error);
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};



export const updateProfileUrl = async (req, res, next) => {
  try {
    const id = req.body.user.userId;
    const {profileUrl}=req.body;
    console.log(profileUrl)
    console.log(id);
    const user = await Users.findById({ _id: id });

    if (!user) {
      return res.status(200).send({
        message: "User Not Found",
        success: false,
      });
    }
    user.profileUrl=profileUrl
    await user.save();
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error while updateing url",
      success: false,
      error: error.message,
    });
  }
};


export const changePassword = async (req, res, next) => {

  const { email, newPassword } = req.body;

  try {
    if (!email || !newPassword) {
      return res.status(400).json({ message: "Email and new password are required" });
    }

    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Assign new password directly (assuming hashing is handled in the User model)
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ message: "Internal Server Error", details: error.message });
  }
};