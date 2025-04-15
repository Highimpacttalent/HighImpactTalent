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
      status: "draft",
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
      workType,
      workMode,
      jobLocation,
      salary,
      experience,
      salaryConfidential,
      jobDescription,
      skills,
      qualifications,
      requirements,
      screeningQuestions,
      applicationLink,
      jobId
    } = req.body;

    if (
      !jobTitle ||
      !jobLocation ||
      !salary ||
      !requirements ||
      !workType ||
      !workMode
    ) {
      next("Please Provide All Required Fields");
      return;
    }

    const jobPost = {
      jobTitle,
      workType,
      workMode,
      jobLocation,
      salaryConfidential,
      salary,
      qualifications,
      experience,
      skills,
      jobDescription, 
      screeningQuestions,
      ...(applicationLink !== undefined && { applicationLink }),
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

export const getJobPosts = async (req, res, next) => {
  try {
    const { search, query, sort, location, searchLocation, exp, workType, workMode, salary, datePosted } = req.query;
    const { skills, user } = req.body;
    const userId = user?.id;
    
    let queryObject = {};

    queryObject.$or = [
      { status: "live" },
      { status: { $exists: false } }
    ];

    if (location || searchLocation) {
      const locationValue = location || searchLocation;
      
      if (locationValue.includes(',')) {
        const locations = locationValue.split(',').map(loc => loc.trim());
        queryObject.jobLocation = { 
          $in: locations.map(loc => new RegExp(loc, 'i')) 
        };
      } else {
        queryObject.jobLocation = { 
          $regex: locationValue, 
          $options: "i" 
        };
      }
    }
    
    if (workType) {
      const workTypes = workType.split(',').map(type => type.trim());
      queryObject.workType = { 
        $in: workTypes 
      };
    }

    if (workMode) {
      const workModes = workMode.split(',').map(mode => mode.trim());
      queryObject.workMode = { 
        $in: workModes 
      };
    }

    if (exp) {
      const experienceRanges = exp.split(',');
      const expConditions = [];
      
      experienceRanges.forEach(range => {
        if (range.includes('-')) {
          const [min, max] = range.split('-').map(Number);
          if (!isNaN(min) && !isNaN(max)) {
            if (max === 100) {
              expConditions.push({
                experience: { $gte: min } 
              });
            } 
            else {
              expConditions.push({
                experience: { 
                  $gte: min, 
                  $lt: max  
                }
              });
            }
          }
        }
      });
      
      if (expConditions.length > 0) {
        if (queryObject.$or) {
          queryObject.$and = queryObject.$and || [];
          queryObject.$and.push({ $or: expConditions });
        } else {
          queryObject.$or = expConditions;
        }
      }
    }

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
              $expr: {
                $and: [
                  { $gte: [{ $toDouble: "$salary" }, minSalary] },
                  { $lt: [{ $toDouble: "$salary" }, maxSalary] }
                ]
              }
            });
          }
        }
      });
      
      if (salaryConditions.length > 0) {
        queryObject.$and = queryObject.$and || [];
        queryObject.$and.push({ $or: salaryConditions });
      }
    }

    if (datePosted) {
      const dateOptions = datePosted.split(',');
      if (dateOptions.includes("Any Time")) {
        // Do nothing, no date filter
      } else {
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
          queryObject.$or = dateConditions;
        }
      }
    }

    const searchTerm = search || query;
    if (searchTerm) {
      const searchQuery = {
        $or: [
          { jobTitle: { $regex: searchTerm, $options: "i" } },
          { jobLocation: { $regex: searchTerm, $options: "i" } },
          { jobDescription: { $regex: searchTerm, $options: "i" } }
        ],
      };
      
      if (queryObject.$and) {
        queryObject.$and.push({ $or: searchQuery.$or });
      } else if (queryObject.$or) {
        queryObject.$and = [
          { $or: queryObject.$or },
          { $or: searchQuery.$or }
        ];
        delete queryObject.$or;
      } else {
        queryObject.$or = searchQuery.$or;
      }
    }

    let queryResult = Jobs.find(queryObject).populate({
      path: "company",
      select: "-password",
    });

    if (sort === "Newest") {
      queryResult = queryResult.sort("-createdAt");
    } else if (sort === "Oldest") {
      queryResult = queryResult.sort("createdAt");
    } else if (sort === "A-Z") {
      queryResult = queryResult.sort("jobTitle");
    } else if (sort === "Z-A") {
      queryResult = queryResult.sort("-jobTitle");
    } else if (sort === "Salary (High to Low)") {
      queryResult = queryResult.sort("-salary");
    } else if (sort === "Salary (Low to High)") {
      queryResult = queryResult.sort("salary");
    } else {
      queryResult = queryResult.sort("-createdAt");
    }

    // Handle pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get total count before applying limit
    const totalJobs = await Jobs.countDocuments(queryObject);
    const numOfPage = Math.ceil(totalJobs / limit);

    // Apply pagination
    queryResult = queryResult.skip(skip).limit(limit);

    // Execute query
    let jobs = await queryResult;

    // Get user preferences if userId is provided
    let userPreferences = null;
    if (userId) {
      userPreferences = await User.findById(userId).select(
        'preferredLocations preferredWorkTypes preferredWorkModes expectedMinSalary skills'
      );
    }

    // Calculate match percentage if user preferences are available
    if (userPreferences) {
      // Convert Mongoose documents to plain objects
      jobs = jobs.map(job => {
        const plainJob = job.toObject ? job.toObject() : job;
        
        // Initialize match metrics
        let totalMatches = 0;
        let totalPossibleMatches = 0;
        const matchDetails = {};

        // 1. Match Skills (highest weight: 35%)
        if (userPreferences.skills && Array.isArray(userPreferences.skills) && plainJob.skills && Array.isArray(plainJob.skills)) {
          const userSkillsLower = userPreferences.skills.map(skill => skill.toLowerCase());
          const jobSkillsLower = plainJob.skills.map(skill => skill.toLowerCase());
          
          const matchingSkills = jobSkillsLower.filter(skill => 
            userSkillsLower.includes(skill)
          );
          
          const skillWeight = 35;
          const skillScore = jobSkillsLower.length > 0 ? 
            (matchingSkills.length / jobSkillsLower.length) * skillWeight : 0;
          
          totalMatches += skillScore;
          totalPossibleMatches += skillWeight;
          matchDetails.skills = {
            score: skillScore,
            maxScore: skillWeight,
            percentage: Math.round((skillScore / skillWeight) * 100)
          };
        }

        // 2. Match Location (weight: 25%)
        if (userPreferences.preferredLocations && Array.isArray(userPreferences.preferredLocations) && plainJob.jobLocation) {
          const userLocationsLower = userPreferences.preferredLocations.map(loc => loc.toLowerCase());
          const jobLocationLower = plainJob.jobLocation.toLowerCase();
          
          const locationMatches = userLocationsLower.some(loc => 
            jobLocationLower.includes(loc) || loc.includes(jobLocationLower)
          );
          
          const locationWeight = 25;
          const locationScore = locationMatches ? locationWeight : 0;
          
          totalMatches += locationScore;
          totalPossibleMatches += locationWeight;
          matchDetails.location = {
            score: locationScore,
            maxScore: locationWeight,
            percentage: locationMatches ? 100 : 0
          };
        }

        // 3. Match Work Type (weight: 15%)
        if (userPreferences.preferredWorkTypes && Array.isArray(userPreferences.preferredWorkTypes) && plainJob.workType) {
          const workTypeMatches = userPreferences.preferredWorkTypes.some(type => 
            plainJob.workType.includes(type)
          );
          
          const workTypeWeight = 15;
          const workTypeScore = workTypeMatches ? workTypeWeight : 0;
          
          totalMatches += workTypeScore;
          totalPossibleMatches += workTypeWeight;
          matchDetails.workType = {
            score: workTypeScore,
            maxScore: workTypeWeight,
            percentage: workTypeMatches ? 100 : 0
          };
        }

        // 4. Match Work Mode (weight: 15%)
        if (userPreferences.preferredWorkModes && Array.isArray(userPreferences.preferredWorkModes) && plainJob.workMode) {
          const workModeMatches = userPreferences.preferredWorkModes.some(mode => 
            plainJob.workMode.includes(mode)
          );
          
          const workModeWeight = 15;
          const workModeScore = workModeMatches ? workModeWeight : 0;
          
          totalMatches += workModeScore;
          totalPossibleMatches += workModeWeight;
          matchDetails.workMode = {
            score: workModeScore,
            maxScore: workModeWeight,
            percentage: workModeMatches ? 100 : 0
          };
        }

        // 5. Match Salary (weight: 10%)
        if (userPreferences.expectedMinSalary && plainJob.salary) {
          const userMinSalary = Number(userPreferences.expectedMinSalary) * 100000;
          const jobSalary = Number(plainJob.salary);
          
          const salaryMatches = !isNaN(userMinSalary) && !isNaN(jobSalary) && jobSalary >= userMinSalary;
          
          const salaryWeight = 10;
          const salaryScore = salaryMatches ? salaryWeight : 0;
          
          totalMatches += salaryScore;
          totalPossibleMatches += salaryWeight;
          matchDetails.salary = {
            score: salaryScore,
            maxScore: salaryWeight,
            percentage: salaryMatches ? 100 : 0
          };
        }

        // Calculate overall match percentage
        const matchPercentage = totalPossibleMatches > 0 ? 
          Math.round((totalMatches / totalPossibleMatches) * 100) : 0;

        return {
          ...plainJob,
          matchPercentage,
          matchDetails
        };
      });

      // Sort by match percentage if requested
      const sortByMatch = req.query.sortByMatch === 'true';
      if (sortByMatch) {
        jobs = jobs.sort((a, b) => b.matchPercentage - a.matchPercentage);
      }
    }

    // Send response
    res.status(200).json({
      success: true,
      totalJobs,
      data: jobs,
      page,
      numOfPage,
      userLoggedIn: !!userId,  // Flag to indicate if user is logged in
      profileComplete: userPreferences ? true : false  // Indicates if user has preferences
    });  
  } catch (error) {
    console.error("Error in getJobPosts:", error);
    res.status(500).json({ 
      success: false,
      message: error.message || "Internal server error" 
    });
  }
};

// Get jobs sorted by salary (High to Low)
export const getJobsBySalaryDesc = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const statusFilter = {
      $or: [
        { status: "live" },
        { status: { $exists: false } }
      ]
    };

    // Fetch jobs sorted by salary in descending order
    const jobs = await Jobs.find(statusFilter)
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

    const statusFilter = {
      $or: [
        { status: "live" },
        { status: { $exists: false } }
      ]
    };

    // Fetch jobs with skill array
    const jobs = await Jobs.find(statusFilter)
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
