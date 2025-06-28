import express from "express";
import {createApplication, getApplication,updateApplicationStatus,getApplicationsOfAjob,getallApplicationOfApplicant, getApplicationsWithJobs, ApplicationStatusUpdate, bulkRejectApplications, bulkAdvanceApplications,getScreeningFilterOptions, getApplicationStageCounts} from "../controllers/ApplicationController.js";
import userAuth from "../middlewares/authMiddleware.js";
import { uploadApplicationResume, uploadResumeMiddleware } from "../controllers/ApplicationController.js";
import { uploadAuth } from "../middlewares/uploadAuth.js";


const router = express.Router();

router.post("/create",createApplication);

router.get("/get/:id",getApplication)

router.get("/get-allapplication/:applicantid",getallApplicationOfApplicant)

router.get("/get-applications/:jobid",getApplicationsOfAjob)

router.put("/status/:id",userAuth,updateApplicationStatus)

router.post("/get-jobs",getApplicationsWithJobs)

router.post("/update-status",ApplicationStatusUpdate)

router.put('/bulk-reject', bulkRejectApplications);

router.put('/bulk-advance', bulkAdvanceApplications);

router.get('/get-screening-filter-options/:jobid', getScreeningFilterOptions);

router.get('/get-stage-counts/:jobid', getApplicationStageCounts);


export default router;