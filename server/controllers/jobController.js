
import mongoose from "mongoose";
import Jobs from "../models/jobsModel.js";
import Companies from "../models/companiesModel.js";
import { application } from "express";
import Application from "../models/ApplicationModel.js";
import calculateJobMatch  from "../utils/jobMatchCalculator.js";
import Users from "../models/userModel.js";
import jwt from 'jsonwebtoken';
import { extractJobKeywords } from "./AiController.js";
import dotenv from 'dotenv';
dotenv.config();

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
      // New fields
      graduationYear,
      tags,
      //courseType,
      diversityPreferences,
      category,
      functionalArea,
      isPremiumJob,
    } = req.body;

    // Validate required fields
    if (!jobTitle  || !jobDescription || !workType || !workMode) {
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
      jobLocation: jobLocation || 'Hybrid',
      ...(salary && !salaryConfidential && { salary }),
      salaryConfidential,
      salaryCategory,
      workType,
      workMode,
      ...(experience && { experience }),
      jobDescription,
      requirements,
      qualifications,
      screeningQuestions,
      company: id,
      status: "draft",
      skills: Array.isArray(skills) ? skills : [],
      // New fields with optional handling
      ...(graduationYear && { graduationYear }),
      tags: Array.isArray(tags) ? tags : [],
      //...(courseType && { courseType }),
      ...(diversityPreferences && { diversityPreferences }),
      category: category || "",
      functionalArea: functionalArea || "",
      isPremiumJob: isPremiumJob || false,
      ...(applicationLink && { applicationLink }),
    };

    const { success, keywords, error } = await extractJobKeywords(jobPost);
    if (!success) {
      return res.status(500).json({
        message: "Failed to generate keyword filters using AI",
        error,
      });
    }

    // Add keywords to jobPost before saving
    jobPost.keywords = keywords;

    // Use session for atomic operations
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      // Create new job
      const job = new Jobs(jobPost);
      await job.save({ session });

      // Update company with new job ID in single operation
      const company = await Companies.findByIdAndUpdate(
        id,
        { $push: { jobPosts: job._id } },
        { session, new: true }
      );

      if (!company) {
        await session.abortTransaction();
        return res.status(404).send(`No Company with id: ${id}`);
      }

      await session.commitTransaction();
      
      res.status(201).json({
        success: true,
        message: "Job Posted Successfully",
        job,
      });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error("Error creating job:", error);
    res.status(500).json({ message: error.message });
  }
};

// update a job using id
export const updateJob = async (req, res, next) => {
  try {
    const { jobId, ...updates } = req.body;

    if (!jobId) {
      return res.status(400).json({ success: false, message: "Job ID is required" });
    }

    if (updates.jobLocation === "") {
      updates.jobLocation = "Hybrid";
    }

    // Filter out undefined fields to avoid overwriting with undefined
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== undefined)
    );

    const updatedJob = await Jobs.findByIdAndUpdate(jobId, filteredUpdates, {
      new: true,
      runValidators: true, // Ensure updated values respect schema validations
    });

    if (!updatedJob) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Job updated successfully",
      updatedJob,
    });
  } catch (error) {
    console.error("Error updating job:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// OPTIMIZED: Main job search function with aggregation pipeline
export const getJobPosts = async (req, res, next) => {
  try {
    const { search, query, sort, location, searchLocation, exp, workType, workMode, salary, datePosted } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 6;
    const skip = (page - 1) * limit;
    
    // Extract user ID from token
    let userId = null;
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.substring(7);
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        userId = decoded.userId || decoded.id || decoded._id;
      } catch (err) {
        console.log("Token validation error:", err.message);
      }
    }

    // Handle "Saved" sort separately for better performance
    if (sort === "Saved") {
      if (!userId) {
        return res.status(401).json({ 
          success: false, 
          message: "Login required for Saved Jobs" 
        });
      }
      
      const user = await Users.findById(userId)
        .select('likedJobs')
        .populate({
          path: "likedJobs",
          model: "Jobs",
          select: "_id jobTitle jobLocation salary workType workMode experience tags createdAt status category functionalArea",
          populate: { 
            path: "company", 
            select: "name location profileUrl" 
          }
        })
        .lean();

      if (!user) {
        return res.status(404).json({ 
          success: false, 
          message: "User not found" 
        });
      }

      const saved = user.likedJobs || [];
      return res.status(200).json({
        success: true,
        totalJobs: saved.length,
        data: saved,
        page: 1,
        numOfPage: 1,
        userLoggedIn: true,
      });
    }

    // Build aggregation pipeline for better performance
    const pipeline = [];

    // Match stage - combine all filters
    const matchStage = {
      $or: [
        { status: "live" },
        { status: { $exists: false } }
      ]
    };

    // Location filter
    if (location || searchLocation) {
      const locationValue = location || searchLocation;
      if (locationValue.includes(',')) {
        const locations = locationValue.split(',').map(loc => loc.trim());
        matchStage.jobLocation = { 
          $in: locations.map(loc => new RegExp(loc, 'i')) 
        };
      } else {
        matchStage.jobLocation = { 
          $regex: locationValue, 
          $options: "i" 
        };
      }
    }

    // Work type filter
    if (workType) {
      const workTypes = workType.split(',').map(type => type.trim());
      matchStage.workType = { $in: workTypes };
    }

    // Work mode filter
    if (workMode) {
      const workModes = workMode.split(',').map(mode => mode.trim());
      matchStage.workMode = { $in: workModes };
    }

    // Experience filter
    if (exp) {
      const experienceRanges = exp.split(',');
      const expConditions = [];
      
      experienceRanges.forEach(range => {
        if (range.includes('-')) {
          const [min, max] = range.split('-').map(Number);
          if (!isNaN(min) && !isNaN(max)) {
            if (max === 100) {
              expConditions.push({ experience: { $gte: min } });
            } else {
              expConditions.push({ experience: { $gte: min, $lt: max } });
            }
          }
        }
      });
      
      if (expConditions.length > 0) {
        matchStage.$and = matchStage.$and || [];
        matchStage.$and.push({ $or: expConditions });
      }
    }

    // Salary filter with optimized numeric conversion
    if (salary) {
      const salaryRanges = salary.split(',');
      const salaryConditions = [];
      
      salaryRanges.forEach(range => {
        if (range.includes('-')) {
          const [min, max] = range.split('-').map(Number);
          if (!isNaN(min) && !isNaN(max)) {
            const minSalary = min * 100000;
            const maxSalary = max * 100000;
            
            salaryConditions.push({
              $and: [
                { salary: { $type: "number", $gte: minSalary } },
                { salary: { $lt: maxSalary } }
              ]
            });
          }
        }
      });
      
      if (salaryConditions.length > 0) {
        matchStage.$and = matchStage.$and || [];
        matchStage.$and.push({ $or: salaryConditions });
      }
    }

    // Date posted filter
    if (datePosted && !datePosted.includes("Any Time")) {
      const dateOptions = datePosted.split(',');
      const dateConditions = [];
      const now = new Date();
      
      dateOptions.forEach(option => {
        const date = new Date(now);
        
        if (option === "Last 24 hours") {
          date.setDate(date.getDate() - 1);
          dateConditions.push({ createdAt: { $gte: date } });
        } else if (option === "Last one week") {
          date.setDate(date.getDate() - 7);
          dateConditions.push({ createdAt: { $gte: date } });
        } else if (option === "Last one month") {
          date.setMonth(date.getMonth() - 1);
          dateConditions.push({ createdAt: { $gte: date } });
        }
      });
      
      if (dateConditions.length > 0) {
        matchStage.$and = matchStage.$and || [];
        matchStage.$and.push({ $or: dateConditions });
      }
    }

    // Search term filter
    const searchTerm = search || query;
    if (searchTerm) {
      matchStage.$and = matchStage.$and || [];
      matchStage.$and.push({
        $or: [
          { jobTitle: { $regex: searchTerm, $options: "i" } },
          { jobLocation: { $regex: searchTerm, $options: "i" } },
          { jobDescription: { $regex: searchTerm, $options: "i" } }
        ]
      });
    }

    pipeline.push({ $match: matchStage });

    // Add company population stage with limited fields
    pipeline.push({
      $lookup: {
        from: 'companies',
        localField: 'company',
        foreignField: '_id',
        as: 'company',
        pipeline: [
          { 
            $project: { 
              name: 1, 
              location: 1, 
              profileUrl: 1,
              organizationType: 1
            } 
          }
        ]
      }
    });

    pipeline.push({
      $unwind: '$company'
    });

    // Project only required fields
    pipeline.push({
      $project: {
        _id: 1,
        jobTitle: 1,
        jobLocation: 1,
        salary: 1,
        salaryConfidential: 1,
        salaryCategory: 1,
        workType: 1,
        workMode: 1,
        experience: 1,
        skills: 1,
        tags: 1,
        category: 1,
        functionalArea: 1,
        isPremiumJob: 1,
        createdAt: 1,
        status: 1,
        company: 1,
        // Only include jobDescription for search purposes, can be excluded if not needed in frontend
        jobDescription: 1,
        // Include application count instead of full array
        applicationCount: { $size: { $ifNull: ["$application", []] } }
      }
    });

    // Add sorting stage
    const sortMap = {
      Newest: { createdAt: -1 },
      Oldest: { createdAt: 1 },
      "A-Z": { jobTitle: 1 },
      "Z-A": { jobTitle: -1 },
      "Salary (High to Low)": { salary: -1 },
      "Salary (Low to High)": { salary: 1 },
    };

    const sortOrder = sortMap[sort] || { createdAt: -1 };
    pipeline.push({ $sort: sortOrder });

    // Execute aggregation with facet for count and data in parallel
    const aggregationPipeline = [
      ...pipeline,
      {
        $facet: {
          data: [
            { $skip: skip },
            { $limit: limit }
          ],
          count: [
            { $count: "total" }
          ]
        }
      }
    ];

    const [result] = await Jobs.aggregate(aggregationPipeline);
    let jobs = result.data || [];
    const totalJobs = result.count[0]?.total || 0;
    const numOfPage = Math.ceil(totalJobs / limit);

    // Handle user preferences and match calculation if user is logged in
    if (userId && jobs.length > 0) {
      const userPrefs = await Users.findById(userId)
        .select('skills preferredLocations preferredWorkTypes preferredWorkModes expectedMinSalary experience')
        .lean();
      
      if (userPrefs) {
        jobs = jobs.map(job => {
          const matchData = calculateJobMatch(userPrefs, job);
          return {
            ...job,
            matchPercentage: matchData.matchPercentage,
            matchDetails: matchData.matchDetails
          };
        });
      }
    }

    // Handle "Recommended" sorting with skills
    if (sort === "Recommended" && req.body.skills) {
      const { skills: userSkills } = req.body;
      
      const calcScore = (jobSkills = [], requiredSkills = []) => {
        const matchCount = jobSkills.filter((s) => requiredSkills.includes(s)).length;
        if (matchCount === requiredSkills.length) return 3;
        if (matchCount > 0) return 2;
        return 1;
      };

      jobs = jobs
        .map((job) => ({
          ...job,
          matchScore: calcScore(job.skills, userSkills),
        }))
        .sort((a, b) => b.matchScore - a.matchScore);
    }

    res.status(200).json({
      success: true,
      totalJobs,
      data: jobs,
      page,
      numOfPage,
      userLoggedIn: !!userId
    });

  } catch (error) {
    console.error("Error in getJobPosts:", error);
    res.status(500).json({ 
      success: false,
      message: error.message || "Internal server error" 
    });
  }
};

// OPTIMIZED: Get jobs sorted by salary (High to Low)
export const getJobsBySalaryDesc = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Use aggregation for better performance
    const pipeline = [
      {
        $match: {
          $or: [
            { status: "live" },
            { status: { $exists: false } }
          ]
        }
      },
      {
        $lookup: {
          from: 'companies',
          localField: 'company',
          foreignField: '_id',
          as: 'company',
          pipeline: [{ $project: { password: 0 } }]
        }
      },
      { $unwind: '$company' },
      { $sort: { salary: -1 } },
      {
        $facet: {
          data: [
            { $skip: skip },
            { $limit: limit }
          ],
          count: [{ $count: "total" }]
        }
      }
    ];

    const [result] = await Jobs.aggregate(pipeline);
    const jobs = result.data || [];
    const totalJobs = result.count[0]?.total || 0;
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

// get a job by id with similar jobs
export const getJobById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Extract user ID from token
    let userId = null;
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.substring(7);
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        userId = decoded.userId || decoded.id || decoded._id;
        console.log("User ID from token:", userId);
      } catch (err) {
        console.log("Token validation error:", err.message);
      }
    }

    // Use Promise.all to fetch job, similar jobs, and user data in parallel
    const promises = [
      // Main job with selected fields only
      Jobs.findById(id)
        .select('_id jobTitle jobLocation salary salaryConfidential salaryCategory workType workMode jobDescription skills qualifications experience duration tags category functionalArea isPremiumJob createdAt status company')
        .populate({
          path: "company",
          select: "name location profileUrl organizationType",
        })
        .lean(),
      
      // Similar jobs with limited fields
      Jobs.aggregate([
        {
          $match: {
            _id: { $ne: new mongoose.Types.ObjectId(id) },
            $or: [
              { status: "live" },
              { status: { $exists: false } }
            ]
          }
        },
        {
          $lookup: {
            from: 'companies',
            localField: 'company',
            foreignField: '_id',
            as: 'company',
            pipeline: [
              { 
                $project: { 
                  name: 1, 
                  location: 1, 
                  profileUrl: 1,
                  organizationType: 1
                } 
              }
            ]
          }
        },
        { $unwind: '$company' },
        {
          $project: {
            _id: 1,
            jobTitle: 1,
            jobLocation: 1,
            salary: 1,
            salaryConfidential: 1,
            salaryCategory: 1,
            workType: 1,
            workMode: 1,
            experience: 1,
            tags: 1,
            category: 1,
            functionalArea: 1,
            isPremiumJob: 1,
            createdAt: 1,
            company: 1,
            applicationCount: { $size: { $ifNull: ["$application", []] } }
          }
        },
        { $sort: { createdAt: -1 } },
        { $limit: 6 }
      ])
    ];

    // Add user data query if user is logged in
    if (userId) {
      promises.push(
        Users.findById(userId)
          .select('experience appliedJobs skills preferredLocations preferredWorkTypes preferredWorkModes expectedMinSalary')
          .lean()
      );
    }

    const results = await Promise.all(promises);
    const [job, similarJobs, userData] = results;

    if (!job) {
      return res.status(404).json({
        message: "Job Post Not Found",
        success: false,
      });
    }

    // Add eligibility and applied status if user is logged in
    if (userId && userData) {
      const userExperience = userData.experience || 0;
      const userAppliedJobs = userData.appliedJobs || [];
      
      // Check eligibility for main job
      let isEligible = true;
      if (job.experience) {
        if (typeof job.experience === 'object' && job.experience !== null) {
          const { minExperience } = job.experience;
          if (minExperience !== undefined && userExperience < minExperience) {
            isEligible = false;
          }
        } else if (typeof job.experience === 'number' && userExperience < job.experience) {
          isEligible = false;
        }
      }
      
      // Check if applied to main job
      const isApplied = userAppliedJobs.some(appliedJobId => 
        appliedJobId.toString() === job._id.toString()
      );
      
      // Add status to main job
      job.isEligible = isEligible;
      job.isApplied = isApplied;
      
      // Calculate match percentage for main job
      if (userData.skills || userData.preferredLocations) {
        const matchData = calculateJobMatch(userData, job);
        job.matchPercentage = matchData.matchPercentage;
        job.matchDetails = matchData.matchDetails;
      }
      
      // Add eligibility and applied status to similar jobs
      similarJobs.forEach(similarJob => {
        // Check eligibility for similar job
        let similarIsEligible = true;
        if (similarJob.experience) {
          if (typeof similarJob.experience === 'object' && similarJob.experience !== null) {
            const { minExperience } = similarJob.experience;
            if (minExperience !== undefined && userExperience < minExperience) {
              similarIsEligible = false;
            }
          } else if (typeof similarJob.experience === 'number' && userExperience < similarJob.experience) {
            similarIsEligible = false;
          }
        }
        
        // Check if applied to similar job
        const similarIsApplied = userAppliedJobs.some(appliedJobId => 
          appliedJobId.toString() === similarJob._id.toString()
        );
        
        similarJob.isEligible = similarIsEligible;
        similarJob.isApplied = similarIsApplied;
        
        // Calculate match percentage for similar job
        if (userData.skills || userData.preferredLocations) {
          const matchData = calculateJobMatch(userData, similarJob);
          similarJob.matchPercentage = matchData.matchPercentage;
          similarJob.matchDetails = matchData.matchDetails;
        }
      });
    }

    res.status(200).json({
      success: true,
      data: job,
      similarJobs,
      userLoggedIn: !!userId,
    });
  } catch (error) {
    console.error("Error in getJobById:", error);
    res.status(404).json({ 
      success: false,
      message: error.message || "Internal server error"
    });
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

    // Use aggregation for better performance
    const jobs = await Jobs.aggregate([
      { $match: { _id: { $in: jobIds.map(id => new mongoose.Types.ObjectId(id)) } } },
      {
        $lookup: {
          from: 'companies',
          localField: 'company',
          foreignField: '_id',
          as: 'company',
          pipeline: [{ $project: { password: 0 } }]
        }
      },
      { $unwind: '$company' }
    ]);

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
    
    // Use Promise.all for parallel operations
    await Promise.all([
      Application.deleteMany({ job: id }),
      Companies.findByIdAndUpdate(companyId, { $pull: { jobPosts: id } }),
      Jobs.findByIdAndDelete(id)
    ]);

    res.status(200).json({
      success: true,
      message: "Job Post Deleted Successfully.",
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

// OPTIMIZED: Get jobs sorted by skill match
export const getJobsBySkills = async (req, res, next) => {
  try {
    const { skills } = req.body;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Use aggregation pipeline for better performance
    const pipeline = [
      {
        $match: {
          $or: [
            { status: "live" },
            { status: { $exists: false } }
          ]
        }
      },
      {
        $addFields: {
          matchScore: {
            $switch: {
              branches: [
                {
                  case: {
                    $eq: [
                      { $size: { $setIntersection: ["$skills", skills] } },
                      { $size: skills }
                    ]
                  },
                  then: 3
                },
                {
                  case: { $gt: [{ $size: { $setIntersection: ["$skills", skills] } }, 0] },
                  then: 2
                }
              ],
              default: 1
            }
          }
        }
      },
      { $sort: { matchScore: -1, createdAt: -1 } },
      {
        $lookup: {
          from: 'companies',
          localField: 'company',
          foreignField: '_id',
          as: 'company',
          pipeline: [{ $project: { password: 0 } }]
        }
      },
      { $unwind: '$company' },
      {
        $facet: {
          data: [
            { $skip: skip },
            { $limit: limit }
          ],
          count: [{ $count: "total" }]
        }
      }
    ];

    const [result] = await Jobs.aggregate(pipeline);
    const jobs = result.data || [];
    const totalJobs = result.count[0]?.total || 0;
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

//Update Status
export const updateJobStatus = async (req, res, next) => {
  try {
    const { jobId, status } = req.body;

    // Validate input
    if (!jobId || !status) {
      return next("Job ID and Status are required");
    }

    // Validate status value
    const validStatuses = ['live', 'draft', 'deleted','paused'];
    if (!validStatuses.includes(status.toLowerCase())) {
      return next("Invalid status value. Allowed values: live, draft, deleted,paused");
    }

    // Find and update the job
    const updatedJob = await Jobs.findByIdAndUpdate(
      jobId,
      { status: status.toLowerCase() },
      { new: true, runValidators: true }
    );

    if (!updatedJob) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Job status updated successfully",
      job: updatedJob,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error updating job status",
      error: error.message
    });
  }
};

export const getSavedJobs = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ success: false, message: "userId is required" });
    }

    // Use aggregation for better performance
    const user = await Users.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: 'jobs',
          localField: 'likedJobs',
          foreignField: '_id',
          as: 'likedJobs',
          pipeline: [
            {
              $lookup: {
                from: 'companies',
                localField: 'company',
                foreignField: '_id',
                as: 'company',
                pipeline: [{ $project: { password: 0 } }]
              }
            },
            { $unwind: '$company' }
          ]
        }
      },
      { $project: { likedJobs: 1 } }
    ]);
    
    if (!user || user.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      savedJobs: user[0].likedJobs || [],
    });
  } catch (error) {
    console.error("Error fetching saved jobs:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching saved jobs",
      error: error.message,
    });
  }
}

export const MatchJobs = async (req, res, next) => {
  try {
    const userId = req.body.user.userId;
    
    // Get user preferences with only needed fields
    const user = await Users.findById(userId)
      .select('skills experience expectedMinSalary preferredLocations preferredWorkModes preferredWorkTypes currentLocation openToRelocate')
      .lean();
      
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Extract user preferences safely
    const userSkills = Array.isArray(user.skills) ? user.skills : [];
    const userExp = typeof user.experience === 'number' ? user.experience : 0;
    const userMinSal = parseInt(user.expectedMinSalary || '0', 10);
    const prefLocs = Array.isArray(user.preferredLocations) ? user.preferredLocations : [];
    const prefModes = Array.isArray(user.preferredWorkModes) ? user.preferredWorkModes : [];
    const prefTypes = Array.isArray(user.preferredWorkTypes) ? user.preferredWorkTypes : [];
    const currentLoc = user.currentLocation || '';
    const openReloc = (user.openToRelocate || '').toLowerCase() === 'yes';

    // Single optimized aggregation pipeline
    const recommendations = await Jobs.aggregate([
      // Initial match - only active jobs that meet basic criteria
      {
        $match: {
          status: 'live',
          experience: { $lte: userExp },
          $expr: {
            $gte: [
              { $convert: { input: "$salary", to: "int", onError: 0 } },
              userMinSal
            ]
          }
        }
      },
      
      // Add computed fields for scoring
      {
        $addFields: {
          skillsArr: { $ifNull: ['$skills', []] },
          salaryNum: { $convert: { input: "$salary", to: "int", onError: 0 } }
        }
      },
      
      // Calculate all scores in one stage
      {
        $addFields: {
          matchedSkillsCount: { $size: { $setIntersection: [userSkills, '$skillsArr'] } },
          reqSkillsCount: { $size: '$skillsArr' },
          isWorkModeOk: { $in: ['$workMode', prefModes] },
          isWorkTypeOk: { $in: ['$workType', prefTypes] },
          isPrefLoc: { $in: ['$jobLocation', prefLocs] },
          isCurrentLoc: { $eq: ['$jobLocation', currentLoc] }
        }
      },
      
      // Calculate final scores
      {
        $addFields: {
          skillScore: {
            $cond: [
              { $eq: ['$reqSkillsCount', 0] },
              0,
              {
                $cond: [
                  { $gte: [{ $divide: ['$matchedSkillsCount', '$reqSkillsCount'] }, 0.5] },
                  1,
                  { $divide: ['$matchedSkillsCount', '$reqSkillsCount'] }
                ]
              }
            ]
          },
          modeScore: { $cond: ['$isWorkModeOk', 1, 0] },
          typeScore: { $cond: ['$isWorkTypeOk', 1, 0] },
          locScore: { 
            $cond: [
              '$isCurrentLoc', 
              1, 
              { $cond: ['$isPrefLoc', 0.75, openReloc ? 0.5 : 0] }
            ]
          }
        }
      },
      
      // Calculate total weighted score
      {
        $addFields: {
          totalScore: {
            $add: [
              { $multiply: ['$skillScore', 0.20] },
              { $multiply: ['$modeScore', 0.15] },
              { $multiply: ['$typeScore', 0.10] },
              { $multiply: ['$locScore', 0.55] }
            ]
          }
        }
      },
      
      // Sort and limit
      { $sort: { totalScore: -1, salaryNum: -1, createdAt: -1 } },
      { $limit: 10 },
      
      // Populate company data
      {
        $lookup: {
          from: 'companies',
          localField: 'company',
          foreignField: '_id',
          as: 'company',
          pipeline: [{ $project: { password: 0 } }]
        }
      },
      { $unwind: '$company' },
      
      // Final projection
      {
        $project: {
          _id: 1,
          jobTitle: 1,
          jobLocation: 1,
          salary: 1,
          workMode: 1,
          workType: 1,
          totalScore: 1,
          createdAt: 1,
          company: 1,
          skills: 1,
          experience: 1,
          jobDescription: 1
        }
      }
    ]);

    return res.json({ finalResponse: recommendations });
    
  } catch (err) {
    console.error('MatchJobs error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
}