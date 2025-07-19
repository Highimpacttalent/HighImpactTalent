import Application from "../models/ApplicationModel.js"; // Adjust the path as necessary
import mongoose from "mongoose";
import Jobs from "../models/jobsModel.js";
import Users from "../models/userModel.js";
import { sendStatusUpdateEmail } from "./sendMailController.js";
import cache from "../utils/cache.js";
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

export const getApplicationsOfAjob = async (req, res) => {
  try {
    console.log("🔵 ENTERED getApplicationsOfAjob");
    const startTime = Date.now();

    const jobId = req.params.jobid;
    const {
      keywords,
      locations,
      designations,
      totalYearsInConsulting,
      screeningFilters,
      sortBy,
      matchLevel, // NEW
    } = req.query ?? {};

    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    // Parse filters
    const parseFilterList = (value) => {
      if (!value?.trim()) return [];
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        return value.split(",").map((x) => x.trim()).filter(Boolean);
      }
    };

    const keywordsList = parseFilterList(keywords);
    const locationsList = parseFilterList(locations);
    const designationsList = parseFilterList(designations);

    let screeningFiltersParsed = {};
    try {
      if (screeningFilters?.trim()) {
        screeningFiltersParsed = typeof screeningFilters === "string"
          ? JSON.parse(screeningFilters)
          : screeningFilters;
      }
    } catch (err) {
      return res.status(400).json({ success: false, message: "Invalid screeningFilters format" });
    }

    // MongoDB Aggregation Pipeline
    const pipeline = [];

    // Match by jobId and status
    const matchStage = {
      job: new mongoose.Types.ObjectId(jobId),
    };
    if (req.query.status?.trim()) {
      matchStage.status = req.query.status.trim();
    }
    if (matchLevel) {
      matchStage.resumeMatchLevel = matchLevel;
    }

    pipeline.push({ $match: matchStage });

    // Lookup Applicant
    pipeline.push({
      $lookup: {
        from: "users",
        localField: "applicant",
        foreignField: "_id",
        as: "applicant",
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

    // Apply Filters inside $match or $addFields/$match
    const andConditions = [];

    // Keywords
    if (keywordsList.length > 0) {
      andConditions.push({
        $or: keywordsList.map((kw) => ({
          $or: [
            { "applicant.firstName": { $regex: kw, $options: "i" } },
            { "applicant.lastName": { $regex: kw, $options: "i" } },
            { "applicant.email": { $regex: kw, $options: "i" } },
            { "applicant.currentCompany": { $regex: kw, $options: "i" } },
            { "applicant.about": { $regex: kw, $options: "i" } },
            { "applicant.skills": { $elemMatch: { $regex: kw, $options: "i" } } },
          ]
        })),
      });
    }

    // Locations
    if (locationsList.length > 0) {
      andConditions.push({
        $or: locationsList.map((loc) => ({
          $or: [
            { "applicant.currentLocation": { $regex: loc, $options: "i" } },
            { "applicant.preferredLocations": { $elemMatch: { $regex: loc, $options: "i" } } },
          ]
        })),
      });
    }

    // Designations
    if (designationsList.length > 0) {
      andConditions.push({
        $or: designationsList.map((des) => ({
          "applicant.currentDesignation": { $regex: des, $options: "i" }
        })),
      });
    }

    // Experience
    if (totalYearsInConsulting?.trim()) {
      const minExp = parseFloat(totalYearsInConsulting);
      if (!isNaN(minExp)) {
        andConditions.push({
          $expr: {
            $gte: [
              { $toDouble: "$applicant.totalYearsInConsulting" },
              minExp,
            ]
          }
        });
      }
    }

    // Screening Filters
    if (Object.keys(screeningFiltersParsed).length > 0) {
      const screeningConditions = [];
      
      for (const [qId, expected] of Object.entries(screeningFiltersParsed)) {
        const questionCondition = {
          'screeningAnswers.questionId': new mongoose.Types.ObjectId(qId)
        };
        
        if (Array.isArray(expected)) {
          // For multi-choice questions
          questionCondition['$or'] = [
            { 'screeningAnswers.answer': { $in: expected } },
            { 'screeningAnswers.answerText': { $regex: expected.join('|'), $options: 'i' } }
          ];
        } else {
          // For single answer questions
          questionCondition['$or'] = [
            { 'screeningAnswers.answer': expected },
            { 'screeningAnswers.answerText': { $regex: expected, $options: 'i' } }
          ];
        }
        
        screeningConditions.push({
          screeningAnswers: { $elemMatch: questionCondition }
        });
      }
      
      if (screeningConditions.length > 0) {
        andConditions.push({ $and: screeningConditions });
      }
    }

    // Final $match after all conditions
    if (andConditions.length > 0) {
      pipeline.push({ $match: { $and: andConditions } });
    }

    // **REMOVE DUPLICATES: Group by applicant and keep the most recent application**
    pipeline.push({
      $sort: { createdAt: -1 } // Sort by creation date descending first
    });

    pipeline.push({
      $group: {
        _id: "$applicant._id", // Group by applicant ID
        // Keep the first document (most recent due to sort above)
        application: { $first: "$$ROOT" },
        totalApplications: { $sum: 1 } // Count total applications from this applicant
      }
    });

    // Replace root with the kept application and add duplicate count
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

    // Apply final sorting after deduplication
    let sortStage = { createdAt: -1 };
    if (sortBy === "az") {
      sortStage = { "applicant.firstName": 1 };
    } else if (sortBy === "za") {
      sortStage = { "applicant.firstName": -1 };
    } else if (sortBy === "matchHighToLow") {
      sortStage = { matchPercentage: -1 };
    } else if (sortBy === "matchLowToHigh") {
      sortStage = { matchPercentage: 1 };
    }

    pipeline.push({ $sort: sortStage });

    // Pagination
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limit });

    // Count total matching applications (unique applicants)
    const countPipeline = [...pipeline];
    countPipeline.pop(); // remove limit
    countPipeline.pop(); // remove skip
    countPipeline.push({ $count: "total" });

    const [applications, totalResult] = await Promise.all([
      Application.aggregate(pipeline),
      Application.aggregate(countPipeline)
    ]);

    const totalApplications = totalResult[0]?.total || 0;

    const responseData = {
      success: true,
      applications,
      totalApplications,
      filters: {
        keywords: keywordsList,
        locations: locationsList,
        designations: designationsList,
        totalYearsInConsulting,
        screeningFilters: screeningFiltersParsed,
        matchLevel,
      },
      performance: {
        totalTime: Date.now() - startTime,
      },
      pagination: {
        page,
        perPage: limit,
        totalApplications,
        totalPages: Math.ceil(totalApplications / limit),
      },
    };

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


// ========================================
// ADDITIONAL PERFORMANCE OPTIMIZATIONS
// ========================================

// 1. Warm up cache for popular jobs
export const warmUpCache = async (popularJobIds) => {
  console.log("🔥 Warming up cache for popular jobs...");
  
  const promises = popularJobIds.map(async (jobId) => {
    const baseKey = `apps_base:${jobId}:all`;
    
    if (!cache.get(baseKey)) {
      try {
        const pipeline = [
          { $match: { job: new mongoose.Types.ObjectId(jobId) } },
          {
            $lookup: {
              from: "users",
              localField: "applicant",
              foreignField: "_id",
              as: "applicant",
              pipeline: [{ $project: { password: 0, __v: 0 } }]
            }
          },
          {
            $lookup: {
              from: "jobs",
              localField: "job",
              foreignField: "_id",
              as: "job",
              pipeline: [{ $project: { __v: 0 } }]
            }
          },
          {
            $lookup: {
              from: "companies",
              localField: "company",
              foreignField: "_id",
              as: "company",
              pipeline: [{ $project: { password: 0, __v: 0 } }]
            }
          },
          { $unwind: { path: "$applicant", preserveNullAndEmptyArrays: true } },
          { $unwind: { path: "$job", preserveNullAndEmptyArrays: true } },
          { $unwind: { path: "$company", preserveNullAndEmptyArrays: true } },
          { $sort: { createdAt: -1 } },
          // Add deduplication to cache warming too
          {
            $group: {
              _id: "$applicant._id",
              application: { $first: "$$ROOT" },
              totalApplications: { $sum: 1 }
            }
          },
          {
            $replaceRoot: {
              newRoot: {
                $mergeObjects: [
                  "$application",
                  { duplicateApplicationsCount: "$totalApplications" }
                ]
              }
            }
          }
        ];
        
        const applications = await Application.aggregate(pipeline);
        cache.set(baseKey, applications, 600);
        
        console.log(`✅ Cached ${applications.length} unique applications for job ${jobId}`);
      } catch (error) {
        console.error(`❌ Failed to warm cache for job ${jobId}:`, error);
      }
    }
  });
  
  await Promise.all(promises);
  console.log("🔥 Cache warm-up complete!");
};

// ========================================
// HELPER FUNCTION - Get Screening Filter Options
// ========================================

export const getScreeningFilterOptions = async (req, res) => {
  try {
    const jobId = req.params.jobid;

    // First get the job's screening questions for structure
    const job = await Jobs.findById(jobId).select("screeningQuestions");

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
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
            // For yes/no questions, ALWAYS provide Yes/No options by default
            // Frontend doesn't send options for yes/no - they're always the same
            filterOptions[questionId].availableAnswers = [
              { label: "Yes", value: "Yes" },
              { label: "No", value: "No" },
            ];
            break;

          case "single_choice":
          case "multi_choice":
            // For choice questions, use predefined options from the job
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
            // For text answers, indicate it's searchable
            filterOptions[questionId].searchable = true;
            break;
        }
      });
    }

    // Now enhance with actual answers from applications
    answerGroups.forEach((group) => {
      const questionId = group._id.toString();

      // If we already have this question from job definition, enhance it
      if (filterOptions[questionId]) {
        // For yes/no questions, we keep the default options but can add statistics
        if (group.questionType === "yes/no") {
          // Count actual responses for statistics
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

          // ALWAYS ensure Yes/No options are available - don't rely on job definition
          filterOptions[questionId].availableAnswers = [
            { label: "Yes", value: "Yes" },
            { label: "No", value: "No" },
          ];
        }
        // For other question types, we might want to add additional info
        else if (
          group.questionType === "short_answer" ||
          group.questionType === "long_answer"
        ) {
          filterOptions[questionId].sampleAnswers = group.answerTexts
            ? group.answerTexts.slice(0, 3)
            : [];
        }
      } else {
        // If question wasn't in job definition, create from application data
        filterOptions[questionId] = {
          question: group.question,
          questionType: group.questionType,
          availableAnswers: [],
        };

        switch (group.questionType) {
          case "yes/no":
            // ALWAYS provide Yes/No options for yes/no questions - no matter what
            filterOptions[questionId].availableAnswers = [
              { label: "Yes", value: "Yes" },
              { label: "No", value: "No" },
            ];

            // Add statistics if we have actual answers
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

    // Final check: Ensure ALL yes/no questions have availableAnswers (most important part!)
    Object.keys(filterOptions).forEach((questionId) => {
      if (filterOptions[questionId].questionType === "yes/no") {
        // FORCE Yes/No options for all yes/no questions regardless of any other logic
        filterOptions[questionId].availableAnswers = [
          { label: "Yes", value: "Yes" },
          { label: "No", value: "No" },
        ];
      }
    });

    res.status(200).json({
      success: true,
      filterOptions,
      jobScreeningQuestions: job.screeningQuestions,
      totalQuestions: Object.keys(filterOptions).length,
    });
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

    // Get counts grouped by status - include all possible statuses
    const statuses = [
      "Applied",
      "Application Viewed",
      "Shortlisted",
      "Interviewing",
      "Hired",
      "Not Progressing",
    ];

    // First get all applications for this job
    const allApplications = await Application.find({
      job: new mongoose.Types.ObjectId(jobId),
    });

    // Initialize counts with all possible statuses
    const stageCounts = {};
    statuses.forEach((status) => {
      stageCounts[status] = 0;
    });

    // Count applications per status
    allApplications.forEach((app) => {
      if (statuses.includes(app.status)) {
        stageCounts[app.status]++;
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
