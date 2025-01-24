import mongoose from "mongoose";
import Jobs from "../models/jobsModel.js";
import Companies from "../models/companiesModel.js";
import { application } from "express";
import Application from "../models/ApplicationModel.js";

// create a job
export const createJob = async (req, res, next) => {
  try {
    const {
      jobTitle,
      jobLocation,
      salary,
      salaryCategory,
      salaryConfidential,
      experience,
      jobDescription,
      requirements,
      qualifications,
      screeningQuestions,
    } = req.body;
    // Validate required fields
    if (!jobTitle||!jobLocation||!jobDescription) {
      return res
        .status(400)
        .json({ message: "Please Provide All Required Fields" });
    }

    const id = req.body.user.userId;

    // Validate company ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).send(`No Company with id: ${id}`);
    }

    // Create job post object
    const jobPost = {
      jobTitle,
      jobLocation,
      salary: salaryConfidential ? null : salary,
      salaryConfidential,
      salaryCategory,
      experience,
      jobDescription,
      requirements,
      qualifications,
      screeningQuestions,
      company: id,
    };

    // Create new job and save to database
    const job = new Jobs(jobPost);
    await job.save();

    // Find company and update with new job ID
    const company = await Companies.findById(id);
    if (!company) {
      return res.status(404).send(`No Company with id: ${id}`);
    }

    company.jobPosts.push(job._id);
    await company.save();

    res.status(201).json({
      success: true,
      message: "Job Posted Successfully",
      job,
    });
  } catch (error) {
    console.error("Error creating job:", error);
    res.status(500).json({ message: error.message });
  }
};

// update a job using id
export const updateJob = async (req, res, next) => {
  try {
    const {
      jobTitle,
      jobType,
      location,
      salary,
      experience,
      desc,
      skills,
      requirements,
      maxApplicants,
      screeningQuestions,
      duration,
    } = req.body;
    const { jobId } = req.params;

    if (
      !jobTitle ||
      !jobType ||
      !location ||
      !salary ||
      !desc ||
      !requirements ||
      !maxApplicants ||
      !duration
    ) {
      next("Please Provide All Required Fields");
      return;
    }
    const id = req.body.user.userId;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).send(`No Company with id: ${id}`);

    const jobPost = {
      jobTitle,
      jobType,
      location,
      salary,
      experience,
      skills,
      detail: { desc, requirements },
      maxApplicants,
      screeningQuestions,
      duration,
      _id: jobId,
    };

    const jobupdate = await Jobs.findByIdAndUpdate(jobId, jobPost, {
      new: true,
    });

    if (!jobupdate) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Job Post Updated SUccessfully",
      jobPost,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

//get all jobs or use query parameter to filter job
export const getJobPosts = async (req, res, next) => {
  try {
    const { search, sort, location, exp } = req.query;
    const experience = exp?.split("-"); //2-6

    let queryObject = {};

    if (location) {
      queryObject.location = { $regex: location, $options: "i" };
    }
    // console.log(jType,types)
    // if (jType) {
    //   queryObject.jobType = { $in: types }
    // }
    // console.log(queryObject.jobType)

    //    [2. 6]
    // console.log('exp',exp,experience,typeof(experience))

    if (exp) {
      queryObject.experience = {
        $gte: Number(experience[0]),
        $lte: Number(experience[1]),
      };
    }

    if (search) {
      const searchQuery = {
        $or: [
          { jobTitle: { $regex: search, $options: "i" } },
          { jobType: { $regex: search, $options: "i" } },
        ],
      };
      queryObject = { ...queryObject, ...searchQuery };
    }

    let queryResult = Jobs.find(queryObject).populate({
      path: "company",
      select: "-password",
    });

    // SORTING
    if (sort === "Newest") {
      queryResult = queryResult.sort("-createdAt");
    }
    if (sort === "Oldest") {
      queryResult = queryResult.sort("createdAt");
    }
    if (sort === "A-Z") {
      queryResult = queryResult.sort("jobTitle");
    }
    if (sort === "Z-A") {
      queryResult = queryResult.sort("-jobTitle");
    }

    // pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    //records count
    const totalJobs = await Jobs.countDocuments(queryResult);
    const numOfPage = Math.ceil(totalJobs / limit);

    queryResult = queryResult.limit(limit * page);

    const jobs = await queryResult;

    res.status(200).json({
      success: true,
      totalJobs,
      data: jobs,
      page,
      numOfPage,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

// get a job by id with  similar jobs
export const getJobById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // const job = await Jobs.findById({ _id: id }).select("+password")
    const job = await Jobs.findById({ _id: id }).populate({
      path: "company",
      select: "-password",
    });
    console.log(job);
    if (!job) {
      return res.status(200).send({
        message: "Job Post Not Found",
        success: false,
      });
    }

    //GET SIMILAR JOB POST
    const searchQuery = {
      $or: [{ jobTitle: { $regex: job?.jobTitle, $options: "i" } }],
    };

    let queryResult = Jobs.find(searchQuery)
      .populate({
        path: "company",
        select: "-password",
      })
      .sort({ _id: -1 });

    queryResult = queryResult.limit(6);
    const similarJobs = await queryResult;

    res.status(200).json({
      success: true,
      data: job,
      similarJobs,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

//delete a job
export const deleteJobPost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const companyId = req.body.user.userId;
    await Application.deleteMany({ job: id });
    await Companies.findByIdAndUpdate(
      { _id: companyId },
      { $pull: { jobPosts: id } }
    );
    await Jobs.findByIdAndDelete(id);

    res.status(200).send({
      success: true,
      messsage: "Job Post Delted Successfully.",
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};
