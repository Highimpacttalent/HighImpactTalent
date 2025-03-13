import express from "express";
import userAuth from "../middlewares/authMiddleware.js";
import {
  createJob,
  deleteJobPost,
  getJobById,
  getJobsByIds,
  getJobPosts,
  updateJob,
} from "../controllers/jobController.js";

const router = express.Router();

// POST JOB
router.post("/upload-job", userAuth, createJob);

// UPDATE JOB
router.put("/update-job/:jobId", userAuth, updateJob);

// GET JOB POSTS
router.get("/find-jobs", getJobPosts);

// GET JOB DETAIL BY ID
router.get("/get-job-detail/:id", getJobById);

//Get Multiple Jobs
router.post("/get-jobs",getJobsByIds)

// DELETE JOB POST
router.delete("/delete-job/:id", userAuth, deleteJobPost);

export default router;

