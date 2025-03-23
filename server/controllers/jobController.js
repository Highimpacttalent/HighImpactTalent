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
      workType,
      workMode,
      experience,
      jobDescription,
      requirements,
      qualifications,
      screeningQuestions,
      applicationLink,
      skills,
    } = req.body;
    // Validate required fields
    if (!jobTitle || !jobLocation || !jobDescription || !workType || !workMode) {
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
      workType,
      workMode,
      experience,
      jobDescription,
      requirements,
      qualifications,
      screeningQuestions,
      company: id,
      ...(applicationLink && { applicationLink }),
      skills: Array.isArray(skills) ? skills : [],
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
      workType,
      workMode,
      location,
      salary,
      experience,
      desc,
      skills,
      requirements,
      maxApplicants,
      screeningQuestions,
      applicationLink,
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
      !duration ||
      !workType ||
      !workMode
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
      workType,
      workMode,
      location,
      salary,
      experience,
      skills,
      detail: { desc, requirements },
      maxApplicants,
      screeningQuestions,
      ...(applicationLink !== undefined && { applicationLink }),
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
    const { search, query, sort, location, searchLocation, exp, workType, workMode, salary, datePosted, isRecommended } = req.query;
    const { skills } = req.body;
    const experience = exp?.split("-"); //2-6

    let queryObject = {};

if (location || searchLocation) {
  const locationValue = location || searchLocation;
  
  
  if (locationValue.includes(',')) {
    const locations = locationValue.split(',');
    queryObject.jobLocation = { $in: locations.map(loc => new RegExp(loc, 'i')) };
  } else {
    queryObject.jobLocation = { $regex: locationValue, $options: "i" };
  }
}
    
    
    if (workType) {
      const workTypes = workType.split(',');
      if (workTypes.length > 1) {
        queryObject.workType = { $in: workTypes };
      } else {
        queryObject.workType = workType;
      }
    }

    
    if (workMode) {
      const workModes = workMode.split(',');
      if (workModes.length > 1) {
        queryObject.workMode = { $in: workModes };
      } else {
        queryObject.workMode = workMode;
      }
    }

    if (exp) {
      queryObject.experience = {
        $gte: Number(experience[0]),
        $lte: Number(experience[1]),
      };
    }

    if (salary) {
      const salaryRange = salary.split("-");
      queryObject.salary = {
        $gte: Number(salaryRange[0]),
        $lte: Number(salaryRange[1]),
      };
    }

    if (datePosted && datePosted !== "Any Time") {
      const date = new Date();
      if (datePosted === "Last 24 hours") {
        date.setDate(date.getDate() - 1);
      } else if (datePosted === "Last one week") {
        date.setDate(date.getDate() - 7);
      } else if (datePosted === "Last one month") {
        date.setMonth(date.getMonth() - 1);
      }
      queryObject.poastingDate = { $gte: date };
    }    

    // Handle both search parameters (search and query)
    const searchTerm = search || query;
    if (searchTerm) {
      const searchQuery = {
        $or: [
          { jobTitle: { $regex: searchTerm, $options: "i" } },
          { location: { $regex: searchTerm, $options: "i" } },
          { jobDescription: { $regex: searchTerm, $options: "i" } } 
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
    // Add new sorting options for salary
    if (sort === "Salary (High to Low)") {
      queryResult = queryResult.sort("-salary");
    }
    if (sort === "Salary (Low to High)") {
      queryResult = queryResult.sort("salary");
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

     // If isRecommended is true, apply skill-based sorting
     if (isRecommended === "true" && skills && Array.isArray(skills)) {
      const calculateMatchScore = (jobSkills, requiredSkills) => {
        const matchCount = jobSkills.filter(skill => requiredSkills.includes(skill)).length;
        if (matchCount === requiredSkills.length) return 3; // All skills match
        if (matchCount > 0) return 2; // Some skills match
        return 1; // No skills match
      };

      jobs = jobs
        .map(job => ({
          ...job.toObject(),
          matchScore: calculateMatchScore(job.skills, skills),
        }))
        .sort((a, b) => b.matchScore - a.matchScore); // Sort by match score in descending order
    }


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

// Get jobs sorted by salary (High to Low)
export const getJobsBySalaryDesc = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Fetch jobs sorted by salary in descending order
    const jobs = await Jobs.find({})
      .sort({ salary: -1 }) // Sorting salary in descending order
      .skip(skip)
      .limit(limit)
      .populate({
        path: "company",
        select: "-password",
      });

    const totalJobs = await Jobs.countDocuments({});
    const numOfPage = Math.ceil(totalJobs / limit);

    res.status(200).json({
      success: true,
      totalJobs,
      data: jobs,
      page,
      numOfPage,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", error: error.message });
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
      $or: [
        { jobTitle: { $regex: job?.jobTitle, $options: "i" } },
        { workType: job?.workType }
      ],
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

//Show liked Jobs 
export const getJobsByIds = async (req, res) => {
  try {
    const { jobIds } = req.body; 

    if (!jobIds || !Array.isArray(jobIds) || jobIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "You have not saved any Job",
      });
    }

    // Find jobs where _id is in the provided jobIds array
    const jobs = await Jobs.find({ _id: { $in: jobIds } }).populate({
      path: "company",
      select: "-password",
    });

    if (jobs.length === 0) {
      return res.status(404).json({
        success: false,
        message: "You have not saved any Job",
      });
    }

    res.status(200).json({
      success: true,
      data: jobs,
    });
  } catch (error) {
    console.error("Error fetching jobs by IDs:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
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

// Get jobs sorted by skill match
export const getJobsBySkills = async (req, res, next) => {
  try {
    const { skills } = req.body;  // skills array from request body
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Fetch jobs with skill array
    const jobs = await Jobs.find({})
      .skip(skip)
      .limit(limit)
      .populate({
        path: "company",
        select: "-password",
      });

    // Helper function to calculate skill match score
    const calculateMatchScore = (jobSkills, requiredSkills) => {
      const matchCount = jobSkills.filter(skill => requiredSkills.includes(skill)).length;
      if (matchCount === requiredSkills.length) {
        return 3; // All skills match
      } else if (matchCount > 0) {
        return 2; // Some skills match
      }
      return 1; // No skills match
    };

    // Sort jobs based on match score
    const sortedJobs = jobs
      .map(job => ({
        ...job.toObject(),
        matchScore: calculateMatchScore(job.skills, skills),
      }))
      .sort((a, b) => b.matchScore - a.matchScore);  // Sort by match score in descending order

    const totalJobs = await Jobs.countDocuments({});
    const numOfPage = Math.ceil(totalJobs / limit);

    res.status(200).json({
      success: true,
      totalJobs,
      data: sortedJobs,
      page,
      numOfPage,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
