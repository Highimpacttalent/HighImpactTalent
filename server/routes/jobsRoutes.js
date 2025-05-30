import express from "express";
import userAuth from "../middlewares/authMiddleware.js";
import {
  createJob,
  deleteJobPost,
  getJobById,
  getJobsByIds,
  getJobPosts,
  updateJob,
  getJobsBySalaryDesc,
  getJobsBySkills,
  updateJobStatus,
  getSavedJobs,
  MatchJobs
} from "../controllers/jobController.js";

const router = express.Router();

// POST JOB
router.post("/upload-job", userAuth, createJob);

// UPDATE JOB
router.put("/update-job", updateJob);

// GET JOB POSTS
router.post("/find-jobs", getJobPosts);

//Top Jobs
router.get("/jobs-by-salary", getJobsBySalaryDesc);

//Recommended Jobs
router.post("/jobs-recommend", getJobsBySkills);

// GET JOB DETAIL BY ID
router.get("/get-job-detail/:id", getJobById);

//Get Multiple Jobs
router.post("/get-jobs",getJobsByIds)

// DELETE JOB POST
router.delete("/delete-job/:id", userAuth, deleteJobPost);

//Status Update 
router.put("/update-status",updateJobStatus)

//Saved Jobs
router.post("/saved-jobs",getSavedJobs)

//Match Jobs
router.get("/match-jobs",userAuth,MatchJobs)

export default router;

