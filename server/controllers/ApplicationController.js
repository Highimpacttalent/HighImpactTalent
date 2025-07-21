import Application from "../models/ApplicationModel.js"; // Adjust the path as necessary
import mongoose from "mongoose";
import Jobs from "../models/jobsModel.js";
import Users from "../models/userModel.js";
import { sendStatusUpdateEmail } from "./sendMailController.js";
import { scoreResumeAgainstJobKeywords } from "../utils/Reommend.js";


// Create a new application
export const createApplication = async (req, res) => {
  try {
    const { job, company, applicant, screeningAnswers, cvUrl } = req.body;

    // Check if cvUrl is provided
    if (!cvUrl) {
      return res.status(400).json({
        success: false,
        message: "Resume URL is required",
      });
    }

    // Check if job exists
    const jobex = await Jobs.findById(job);
    if (!jobex) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Check if user exists
    const userex = await Users.findById(applicant);
    if (!userex) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if applicant meets experience requirements
    if (Number(jobex.experience) > Number(userex.experience)) {
      return res.status(400).json({
        success: false,
        message: "You are not eligible for this job.",
      });
    }

    // Check if already applied
    const isAlreadyApplied = await Application.findOne({ applicant, job });
    if (isAlreadyApplied) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job.",
      });
    }

    // Validate screening questions if they exist
    if (jobex.screeningQuestions && jobex.screeningQuestions.length > 0) {
      // Check if mandatory questions are answered
      for (const question of jobex.screeningQuestions) {
        if (question.isMandatory) {
          const answered =
            screeningAnswers &&
            screeningAnswers.some(
              (ans) =>
                ans.questionId.toString() === question._id.toString() &&
                ans.answer &&
                ans.answer.trim() !== ""
            );

          if (!answered) {
            return res.status(400).json({
              success: false,
              message: `Mandatory screening question "${question.question}" must be answered.`,
            });
          }
        }
      }
    }

    // Prepare screening answers with both question text and answer
    let formattedScreeningAnswers = [];
    if (screeningAnswers && screeningAnswers.length > 0) {
      // Filter out empty answers
      const validAnswers = screeningAnswers.filter(
        (answer) => answer.answer && answer.answer.trim() !== ""
      );

      formattedScreeningAnswers = validAnswers.map((answer) => {
        const question = jobex.screeningQuestions.find(
          (q) => q._id.toString() === answer.questionId.toString()
        );
        return {
          questionId: answer.questionId,
          question: question ? question.question : "",
          answer: answer.answer.trim(),
        };
      });
    }

    const {
      success: scoringSuccess,
      scoreLabel,
      matchPercentage,
      breakdown,
    } = await scoreResumeAgainstJobKeywords(cvUrl, jobex, userex);

    if (!scoringSuccess) {
      return res.status(500).json({
        success: false,
        message: "Failed to evaluate resume against job keywords",
      });
    }

    // Create application with screening answers and cvUrl
    const newApplication = await Application.create({
      job,
      company,
      applicant,
      cvUrl,
      resumeMatchLevel: scoreLabel,
      matchPercentage,
      matchBreakdown: breakdown,
      screeningAnswers: formattedScreeningAnswers,
      statusHistory: [{ status: "Applied", changedAt: new Date() }],
    });

    // Update user's applied jobs
    const user = await Users.findByIdAndUpdate(
      { _id: applicant },
      { $push: { appliedJobs: job } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Applicant not found",
      });
    }

    // Update job's applications
    const jobmodel = await Jobs.findByIdAndUpdate(
      { _id: job },
      { $push: { application: newApplication._id } }
    );

    if (!jobmodel) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      newApplication,
      user,
    });
  } catch (error) {
    console.error("Error creating application:", error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

//get application by id
export const getApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate("job")
      .populate("company")
      .populate("applicant");
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateApplicationStatus = async (req, res) => {
  const { applicationId, status } = req.body;

  try {
    const companyId = req.body.user.userId;
    let application = await Application.findById(applicationId)
      .populate("applicant", "email firstName")
      .populate("job", "jobTitle")
      .populate("company", "name");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (companyId != application.company._id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to update status",
      });
    }

    // Update status and add to history
    application.status = status;
    application.statusHistory.push({
      status,
      changedAt: new Date(),
    });

    await application.save();

    const email = application.applicant.email;
    const name = application.applicant.firstName;
    const jobTitle = application.job?.jobTitle || "Position";
    const companyName = application.company?.name || "Company";

    await sendStatusUpdateEmail(email, status, name, jobTitle, companyName);

    res.status(200).json({
      success: true,
      message: "Application status updated successfully",
      application,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Helper function to parse filters with multiple words support
const parseFilters = (query) => {
  const result = {};
  
  // Enhanced parseList function that splits by comma or space
  const parseList = (value) => {
    if (!value?.trim()) return [];
    const arr = Array.isArray(value) ? value : value.split(',');
    return arr.map(x => x.trim()).filter(Boolean);
  };

  

   // ✅ Parse numeric fields safely
  const parseNumber = (value) => {
    const num = parseFloat(value);
    return isNaN(num) ? undefined : num;
  };

    // ✅ Parse experience and salary ranges
    if (query.minExperience !== undefined) {
      result.minExperience = parseNumber(query.minExperience);
    }

    if (query.maxExperience !== undefined) {
      result.maxExperience = parseNumber(query.maxExperience);
    }

    if (query.minSalary !== undefined) {
      result.minSalary = query.minSalary;
    }

    if (query.maxSalary !== undefined) {
      result.maxSalary = query.maxSalary;
    }

  // Parse screening filters with support for multiple values
  if (query.screeningFilters) {
    try {
    if (typeof query.screeningFilters === 'string' && query.screeningFilters.trim() !== '') {
      result.screeningFilters = JSON.parse(query.screeningFilters);
    } else if (typeof query.screeningFilters === 'object') {
      result.screeningFilters = query.screeningFilters;
    } else {
      result.screeningFilters = {}; // Default to an empty object if format is weird
    }

    // Convert single values to arrays for consistency (this part is fine)
    Object.keys(result.screeningFilters).forEach(key => {
      if (!Array.isArray(result.screeningFilters[key])) {
        result.screeningFilters[key] = [result.screeningFilters[key]];
      }
    });
  } catch (err) {
    // This catch is still a good fallback
    throw new Error('Invalid screeningFilters format');
  }
  }

  // Parse other filters with multiple words support
  ['keywords', 'locations', 'designations'].forEach(field => {
    if (query[field]) {
      result[field] = parseList(query[field]);
    }
  });

  if (query.totalYearsInConsulting) {
    result.totalYearsInConsulting = query.totalYearsInConsulting;
  }

  if (query.matchLevel) {
    result.resumeMatchLevel = query.matchLevel;
  }

  if (query.status) {
    result.status = query.status.trim();
  }

  return result;
};

// Main function to get applications
export const getApplicationsOfAjob = async (req, res) => {
  try {
    console.log("🔵 ENTERED getApplicationsOfAjob");
    const startTime = Date.now();
    const jobId = req.params.jobid;
    const { page = 1, limit = 20, sortBy } = req.query;
    const skip = (page - 1) * limit;

    // Parse filters with multiple words support
    const filters = parseFilters(req.query);
    
    // Build base query
    const baseQuery = {
      job: new mongoose.Types.ObjectId(jobId),
      ...(filters.status && { status: filters.status }),
      ...(filters.resumeMatchLevel && { resumeMatchLevel: filters.resumeMatchLevel })
    };

    // Build aggregation pipeline
    const pipeline = [];
    
    // Initial match stage
    pipeline.push({ $match: baseQuery });

    // Optimized applicant lookup with only needed fields
    pipeline.push({
      $lookup: {
        from: "users",
        localField: "applicant",
        foreignField: "_id",
        as: "applicant",
        pipeline: [
          {
            $project: {
              firstName: 1,
              lastName: 1,
              email: 1,
              currentCompany: 1,
              about: 1,
              skills: 1,
              currentLocation: 1,
              preferredLocations: 1,
              currentDesignation: 1,
              totalYearsInConsulting: 1,
              cvUrl: 1,
              linkedinLink:1,
              openToRelocate: 1,
              experience: 1,
              preferredWorkTypes: 1,
              preferredWorkModes: 1,
              currentSalary: 1,
              highestQualification: 1
            }
          }
        ]
      }
    });
    pipeline.push({ $unwind: { path: "$applicant", preserveNullAndEmptyArrays: true } });

    // Lookup Job
    pipeline.push({
      $lookup: {
        from: "jobs",
        localField: "job",
        foreignField: "_id",
        as: "job",
      }
    });
    pipeline.push({ $unwind: { path: "$job", preserveNullAndEmptyArrays: true } });

    // Lookup Company
    pipeline.push({
      $lookup: {
        from: "companies",
        localField: "company",
        foreignField: "_id",
        as: "company",
      }
    });
    pipeline.push({ $unwind: { path: "$company", preserveNullAndEmptyArrays: true } });

    // Add filter conditions with multiple words support
    const andConditions = [];
    
    // Keyword filtering - search each keyword separately
    if (filters.keywords?.length > 0) {
      const keywordConditions = filters.keywords.map(keyword => ({
        $or: [
          { "applicant.firstName": { $regex: keyword, $options: "i" } },
          { "applicant.lastName": { $regex: keyword, $options: "i" } },
          { "applicant.email": { $regex: keyword, $options: "i" } },
          { "applicant.currentCompany": { $regex: keyword, $options: "i" } },
          { "applicant.about": { $regex: keyword, $options: "i" } },
          { "applicant.skills": { $elemMatch: { $regex: keyword, $options: "i" } } },
        ]
      }));
      andConditions.push({ $or: keywordConditions });
    }

    // Location filtering - search each location separately
    if (filters.locations?.length > 0) {
  const locationConditions = [];

  filters.locations.forEach(location => {
    locationConditions.push({
      $expr: {
        $regexMatch: {
          input: { $trim: { input: "$applicant.currentLocation" } },
          regex: location,
          options: "i"
        }
      }
    });
    locationConditions.push({
      $expr: {
        $regexMatch: {
          input: { $trim: { input: { $arrayElemAt: ["$applicant.preferredLocations", 0] } } },
          regex: location,
          options: "i"
        }
      }
    });
  });

  if (locationConditions.length > 0) {
    andConditions.push({ $or: locationConditions });
  }
}



    // Designation filtering - search each designation separately
    if (filters.designations?.length > 0) {
      const designationConditions = filters.designations.map(designation => ({
        "applicant.currentDesignation": { $regex: designation, $options: "i" }
      }));
      andConditions.push({ $or: designationConditions });
    }

    // Experience filtering
    if (filters.totalYearsInConsulting) {
      const minExp = parseFloat(filters.totalYearsInConsulting);
      if (!isNaN(minExp)) {
        andConditions.push({
          $expr: {
            $gte: [
              { $toDouble: "$applicant.totalYearsInConsulting" },
              minExp
            ]
          }
        });
      }
    }

   // ---------------- EXPERIENCE RANGE FILTER ----------------
    const experienceConditions = [];
    const minExperience = parseFloat(filters.minExperience);
    const maxExperience = parseFloat(filters.maxExperience);

    if (!isNaN(minExperience)) {
      experienceConditions.push({
        $gte: [{ $toDouble: "$applicant.experience" }, minExperience]
      });
    }

    if (!isNaN(maxExperience)) {
      experienceConditions.push({
        $lte: [{ $toDouble: "$applicant.experience" }, maxExperience]
      });
    }

    if (experienceConditions.length > 0) {
      const experienceFilter = {
        $expr: experienceConditions.length === 1
          ? experienceConditions[0]
          : { $and: experienceConditions }
      };

      console.log("✅ Adding experience filter to pipeline:", JSON.stringify(experienceFilter, null, 2));
      andConditions.push(experienceFilter);
    } else {
      console.log("ℹ️ No valid experience filters found.");
    }


    // ---------------- SALARY RANGE FILTER ----------------
    const salaryConditions = [];
    const minSalary = parseFloat(filters.minSalary);
    const maxSalary = parseFloat(filters.maxSalary);

    const convertedSalaryExpr = {
      $convert: {
        input: "$applicant.currentSalary",
        to: "double",
        onError: 0,
        onNull: 0
      }
    };

    if (!isNaN(minSalary)) {
      salaryConditions.push({ $gte: [convertedSalaryExpr, minSalary] });
    }

    if (!isNaN(maxSalary)) {
      salaryConditions.push({ $lte: [convertedSalaryExpr, maxSalary] });
    }

    if (salaryConditions.length > 0) {
      const salaryFilter = {
        $expr: salaryConditions.length === 1
          ? salaryConditions[0]
          : { $and: salaryConditions }
      };

      console.log("✅ Adding salary filter to pipeline:", JSON.stringify(salaryFilter, null, 2));
      andConditions.push(salaryFilter);
    } else {
      console.log("ℹ️ No valid salary filters found.");
    }



    // Enhanced screening questions filtering with multiple choice support
    if (filters.screeningFilters && Object.keys(filters.screeningFilters).length > 0) {
      const screeningConditions = Object.entries(filters.screeningFilters).map(([qId, expectedValues]) => {
        const questionCondition = {
          'questionId': new mongoose.Types.ObjectId(qId)
        };
        
        // Handle multiple expected values (for multi-choice questions)
        questionCondition['$or'] = [
          { 'answer': { $in: expectedValues } },
          { 'answerText': { $regex: expectedValues.join('|'), $options: 'i' } }
        ];
        
        return {
          screeningAnswers: { $elemMatch: questionCondition }
        };
      });
      
      andConditions.push({ $and: screeningConditions });
    }

    // Add filter conditions to pipeline
    if (andConditions.length > 0) {
      pipeline.push({ $match: { $and: andConditions } });
    }

    // Deduplicate applications by applicant (keep most recent)
    pipeline.push({ $sort: { createdAt: -1 } });
    pipeline.push({
      $group: {
        _id: "$applicant._id",
        application: { $first: "$$ROOT" },
        totalApplications: { $sum: 1 }
      }
    });
    pipeline.push({
      $replaceRoot: {
        newRoot: {
          $mergeObjects: [
            "$application",
            { duplicateApplicationsCount: "$totalApplications" }
          ]
        }
      }
    });

    // Sorting
    let sortStage = { createdAt: -1 };
    switch (sortBy) {
      case "az": sortStage = { "applicant.firstName": 1 }; break;
      case "za": sortStage = { "applicant.firstName": -1 }; break;
      case "matchHighToLow": sortStage = { matchPercentage: -1 }; break;
      case "matchLowToHigh": sortStage = { matchPercentage: 1 }; break;
    }
    pipeline.push({ $sort: sortStage });

    // Pagination
    const paginationPipeline = [...pipeline];
    paginationPipeline.push({ $skip: skip });
    paginationPipeline.push({ $limit: parseInt(limit) });

    // Count pipeline
    const countPipeline = [...pipeline];
    countPipeline.push({ $count: "total" });

    // Execute both queries in parallel
    const [applications, totalResult] = await Promise.all([
      Application.aggregate(paginationPipeline),
      Application.aggregate(countPipeline)
    ]);

    const totalApplications = totalResult[0]?.total || 0;

    // Prepare response
    const responseData = {
      success: true,
      applications,
      totalApplications,
      filters: {
        keywords: filters.keywords || [],
        locations: filters.locations || [],
        designations: filters.designations || [],
        totalYearsInConsulting: filters.totalYearsInConsulting,
        screeningFilters: filters.screeningFilters || {},
        matchLevel: filters.resumeMatchLevel,
      },
      performance: {
        totalTime: Date.now() - startTime,
        //cache: 'miss'
      },
      pagination: {
        page: parseInt(page),
        perPage: parseInt(limit),
        totalApplications,
        totalPages: Math.ceil(totalApplications / limit),
      },
    };

    // Cache the result
    //appCache.set(cacheKey, responseData);

    console.log(`🎯 Optimized response time: ${responseData.performance.totalTime}ms`);
    console.log(`📊 Unique applicants returned: ${applications.length}`);

    return res.status(200).json(responseData);
  } catch (error) {
    console.error("❌ Error in getApplicationsOfAjob:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Server Error while fetching applications",
    });
  }
};

export const getScreeningFilterOptions = async (req, res) => {
  try {
    const jobId = req.params.jobid;

    const job = await Jobs.findById(jobId)
      .select('screeningQuestions')
      .lean();

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found"
      });
    }

    // Get unique screening answers for this job
    const pipeline = [
      { $match: { job: new mongoose.Types.ObjectId(jobId) } },
      { $unwind: "$screeningAnswers" },
      {
        $group: {
          _id: "$screeningAnswers.questionId",
          question: { $first: "$screeningAnswers.question" },
          questionType: { $first: "$screeningAnswers.questionType" },
          uniqueAnswers: { $addToSet: "$screeningAnswers.answer" },
          answerTexts: { $addToSet: "$screeningAnswers.answerText" },
        },
      },
    ];

    const answerGroups = await Application.aggregate(pipeline);

    const filterOptions = {};

    // Process screening questions from job definition first
    if (job.screeningQuestions && job.screeningQuestions.length > 0) {
      job.screeningQuestions.forEach((question) => {
        const questionId = question._id.toString();

        filterOptions[questionId] = {
          question: question.question,
          questionType: question.questionType,
          isMandatory: question.isMandatory || false,
          order: question.order || 0,
          availableAnswers: [],
        };

        // Handle different question types
        switch (question.questionType) {
          case "yes/no":
            filterOptions[questionId].availableAnswers = [
              { label: "Yes", value: "Yes" },
              { label: "No", value: "No" },
            ];
            break;

          case "single_choice":
          case "multi_choice":
            if (question.options && Array.isArray(question.options)) {
              filterOptions[questionId].availableAnswers = question.options.map(
                (option) => ({
                  label: option,
                  value: option,
                })
              );
            }
            break;

          case "short_answer":
          case "long_answer":
            filterOptions[questionId].searchable = true;
            break;
        }
      });
    }

    // Now enhance with actual answers from applications
    answerGroups.forEach((group) => {
      const questionId = group._id.toString();

      if (filterOptions[questionId]) {
        if (group.questionType === "yes/no") {
          const yesAnswers = group.uniqueAnswers.filter((ans) => {
            if (typeof ans === "string") return ans.toLowerCase() === "yes";
            return false;
          });

          const noAnswers = group.uniqueAnswers.filter((ans) => {
            if (typeof ans === "string") return ans.toLowerCase() === "no";
            return false;
          });

          filterOptions[questionId].statistics = {
            yesCount: yesAnswers.length,
            noCount: noAnswers.length,
            totalResponses: yesAnswers.length + noAnswers.length,
          };

          filterOptions[questionId].availableAnswers = [
            { label: "Yes", value: "Yes" },
            { label: "No", value: "No" },
          ];
        }
        else if (
          group.questionType === "short_answer" ||
          group.questionType === "long_answer"
        ) {
          filterOptions[questionId].sampleAnswers = group.answerTexts
            ? group.answerTexts.slice(0, 3)
            : [];
        }
      } else {
        filterOptions[questionId] = {
          question: group.question,
          questionType: group.questionType,
          availableAnswers: [],
        };

        switch (group.questionType) {
          case "yes/no":
            filterOptions[questionId].availableAnswers = [
              { label: "Yes", value: "Yes" },
              { label: "No", value: "No" },
            ];

            const yesAnswers = group.uniqueAnswers.filter((ans) => {
              if (typeof ans === "string") return ans.toLowerCase() === "yes";
              return false;
            });

            const noAnswers = group.uniqueAnswers.filter((ans) => {
              if (typeof ans === "string") return ans.toLowerCase() === "no";
              return false;
            });

            filterOptions[questionId].statistics = {
              yesCount: yesAnswers.length,
              noCount: noAnswers.length,
              totalResponses: yesAnswers.length + noAnswers.length,
            };
            break;

          case "single_choice":
          case "multi_choice":
            const choiceAnswers = group.uniqueAnswers.filter(
              (answer) => typeof answer === "string" && answer.trim() !== ""
            );
            filterOptions[questionId].availableAnswers = [
              ...new Set(choiceAnswers),
            ].map((answer) => ({
              label: answer,
              value: answer,
            }));
            break;

          case "short_answer":
          case "long_answer":
            filterOptions[questionId].searchable = true;
            filterOptions[questionId].sampleAnswers = group.answerTexts
              ? group.answerTexts.slice(0, 3)
              : [];
            break;
        }
      }
    });

    // Final check: Ensure ALL yes/no questions have availableAnswers
    Object.keys(filterOptions).forEach((questionId) => {
      if (filterOptions[questionId].questionType === "yes/no") {
        filterOptions[questionId].availableAnswers = [
          { label: "Yes", value: "Yes" },
          { label: "No", value: "No" },
        ];
      }
    });

    // Prepare response data
    const responseData = {
      success: true,
      filterOptions,
      jobScreeningQuestions: job.screeningQuestions,
      totalQuestions: Object.keys(filterOptions).length,
    };

    // Cache the results
    //appCache.set(cacheKey, responseData, 3600); // 1 hour TTL

    res.status(200).json(responseData);
  } catch (error) {
    console.error("Error getting screening filter options:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getApplicationStageCounts = async (req, res) => {
  try {
    const jobId = req.params.jobid;
  
    // Validate job ID
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID",
      });
    }

    // Get counts grouped by status
    const statuses = [
      "Applied",
      "Application Viewed",
      "Shortlisted",
      "Interviewing",
      "Hired",
      "Not Progressing",
    ];

    const result = await Application.aggregate([
      { $match: { job: new mongoose.Types.ObjectId(jobId) } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
      { $project: { _id: 0, status: "$_id", count: 1 } }
    ]);

    // Initialize counts with all possible statuses
    const stageCounts = {};
    statuses.forEach((status) => {
      stageCounts[status] = 0;
    });

    // Update with actual counts
    result.forEach((item) => {
      if (statuses.includes(item.status)) {
        stageCounts[item.status] = item.count;
      }
    });

    res.status(200).json({
      success: true,
      stageCounts,
    });
  } catch (error) {
    console.error("Error getting stage counts:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getallApplicationOfApplicant = async (req, res) => {
  try {
    const id = req.params.applicantid;

    const userapplication = await Application.find({ applicant: id })
      .populate("job")
      .populate("company");
    res.status(200).json({
      success: true,
      data: userapplication,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      success: false,
    });
  }
};

export const getApplicationsWithJobs = async (req, res) => {
  try {
    const { applicationIds, userId } = req.body;

    let applications;

    if (userId) {
      // If userId is provided, get all applications for that user
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid userId format.",
        });
      }

      applications = await Application.find({
        applicant: new mongoose.Types.ObjectId(userId),
      })
        .populate("job")
        .populate("company")
        .sort({ createdAt: -1 });
    } else if (
      applicationIds &&
      Array.isArray(applicationIds) &&
      applicationIds.length > 0
    ) {
      // If applicationIds array is provided, get specific applications
      const validIds = applicationIds
        .filter((id) => mongoose.Types.ObjectId.isValid(id))
        .map((id) => new mongoose.Types.ObjectId(id));

      if (validIds.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No valid ObjectId format found in provided IDs.",
        });
      }

      applications = await Application.find({
        _id: { $in: validIds },
      })
        .populate("job")
        .populate("company");
    } else {
      return res.status(400).json({
        success: false,
        message: "Please provide either userId or applicationIds array.",
      });
    }

    if (applications.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No applications found.",
        debug: {
          userId: userId || null,
          applicationIds: applicationIds || null,
        },
      });
    }

    res.status(200).json({
      success: true,
      applications,
      count: applications.length,
    });
  } catch (error) {
    console.error("Error in getApplicationsWithJobs:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// controller: updateApplicationStatus
export const ApplicationStatusUpdate = async (req, res) => {
  const { status, applicationId } = req.body;

  const allowedStatuses = [
    "Applied",
    "Application Viewed",
    "Shortlisted",
    "Interviewing",
    "Hired",
    "Not Progressing",
  ];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Invalid status provided",
    });
  }

  try {
    const application = await Application.findById(applicationId)
      .populate("applicant", "email firstName")
      .populate("job", "jobTitle")
      .populate("company", "name");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.status = status;

    // Always update status history
    application.statusHistory.push({
      status,
      changedAt: new Date(),
    });

    await application.save();

    const email = application.applicant.email;
    const name = application.applicant.firstName;
    const jobTitle = application.job?.jobTitle || "Position";
    const companyName = application.company?.name || "Company";

    await sendStatusUpdateEmail(email, status, name, jobTitle, companyName);

    res.status(200).json({
      success: true,
      message: `Application status updated to '${status}'`,
      application,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error", err.message);
  }
};

// Bulk reject applications (set to "Not Progressing")
export const bulkRejectApplications = async (req, res) => {
  const { applicationIds } = req.body;

  try {
    const companyId = req.body.user.userId;

    // Validate input
    if (
      !applicationIds ||
      !Array.isArray(applicationIds) ||
      applicationIds.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Application IDs array is required and cannot be empty",
      });
    }

    // Find all applications
    const applications = await Application.find({
      _id: { $in: applicationIds },
    })
      .populate("applicant", "email firstName")
      .populate("job", "jobTitle")
      .populate("company", "name");

    if (applications.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No applications found",
      });
    }

    // Check authorization - ensure all applications belong to the company
    for (let application of applications) {
      if (companyId != application.company._id) {
        return res.status(401).json({
          success: false,
          message: "Not authorized to update status",
        });
      }
    }

    // send emails in parallel
    await Promise.all(
      applications.map((app) => {
        const email = app.applicant.email;
        const name = app.applicant.firstName;
        const jobTitle = app.job?.jobTitle || "Position";
        const companyName = app.company?.name || "Company";

        return sendStatusUpdateEmail(
          email,
          "Not Progressing",
          name,
          jobTitle,
          companyName
        );
      })
    );

    // Bulk update applications
    const bulkOps = applications.map((app) => ({
      updateOne: {
        filter: { _id: app._id },
        update: {
          $set: { status: "Not Progressing" },
          $push: {
            statusHistory: {
              status: "Not Progressing",
              changedAt: new Date(),
            },
          },
        },
      },
    }));

    const result = await Application.bulkWrite(bulkOps);

    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} applications rejected successfully`,
      modifiedCount: result.modifiedCount,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Bulk advance applications to next round
export const bulkAdvanceApplications = async (req, res) => {
  const { applicationIds } = req.body;

  try {
    const companyId = req.body.user.userId;

    // Validate input
    if (
      !applicationIds ||
      !Array.isArray(applicationIds) ||
      applicationIds.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Application IDs array is required and cannot be empty",
      });
    }

    // Find all applications
    const applications = await Application.find({
      _id: { $in: applicationIds },
    })
      .populate("applicant", "email firstName")
      .populate("job", "jobTitle")
      .populate("company", "name");

    if (applications.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No applications found",
      });
    }

    // Check authorization - ensure all applications belong to the company
    for (let application of applications) {
      if (companyId != application.company._id) {
        return res.status(401).json({
          success: false,
          message: "Not authorized to update status",
        });
      }
    }

    // Define status progression logic
    const getNextStatus = (currentStatus) => {
      const statusFlow = {
        Applied: "Application Viewed",
        "Application Viewed": "Shortlisted",
        Shortlisted: "Interviewing",
        Interviewing: "Hired",
      };

      return statusFlow[currentStatus] || currentStatus;
    };

    await Promise.all(
      applications.map((app) => {
        const nextStatus = getNextStatus(app.status);
        const email = app.applicant.email;
        const name = app.applicant.firstName;
        const jobTitle = app.job?.jobTitle || "Position";
        const companyName = app.company?.name || "Company";

        return sendStatusUpdateEmail(
          email,
          nextStatus,
          name,
          jobTitle,
          companyName
        );
      })
    );

    // Prepare bulk operations
    const bulkOps = applications.map((app) => {
      const nextStatus = getNextStatus(app.status);

      return {
        updateOne: {
          filter: { _id: app._id },
          update: {
            $set: { status: nextStatus },
            $push: {
              statusHistory: {
                status: nextStatus,
                changedAt: new Date(),
              },
            },
          },
        },
      };
    });

    const result = await Application.bulkWrite(bulkOps);

    // Get updated applications to return current status info
    const updatedApplications = await Application.find({
      _id: { $in: applicationIds },
    }).select("_id status");

    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} applications advanced successfully`,
      modifiedCount: result.modifiedCount,
      updatedApplications: updatedApplications,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const updateSingleApplicationStatus = async (req, res) => {
  const { applicationId, status } = req.body;
  const userId = req.body.user?.userId;

  const allowedStatuses = [
    "Applied",
    "Application Viewed",
    "Shortlisted",
    "Interviewing",
    "Hired",
    "Not Progressing",
  ];

  if (!applicationId || !status) {
    return res.status(400).json({
      success: false,
      message: "Both applicationId and status are required.",
    });
  }

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Invalid status provided.",
    });
  }

  try {
    const application = await Application.findById(applicationId)
      .populate("applicant", "email firstName")
      .populate("job", "jobTitle")
      .populate("company", "name");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // Authorization check (optional, but mirrors the bulk route)
    if (userId && userId != application.company?._id?.toString()) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to update this application",
      });
    }

    const email = application.applicant.email;
    const name = application.applicant.firstName;
    const jobTitle = application.job?.jobTitle || "Position";
    const companyName = application.company?.name || "Company";

    // Update status and history
    application.status = status;
    application.statusHistory.push({
      status,
      changedAt: new Date(),
    });

    await application.save();

    await sendStatusUpdateEmail(email, status, name, jobTitle, companyName);

    return res.status(200).json({
      success: true,
      message: `Application status updated to '${status}'`,
      updatedApplication: {
        _id: application._id,
        status: application.status,
      },
    });
  } catch (err) {
    console.error("Error updating application status:", err.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
