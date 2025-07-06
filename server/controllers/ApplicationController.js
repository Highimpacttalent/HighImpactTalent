import Application from "../models/ApplicationModel.js"; // Adjust the path as necessary
import mongoose from "mongoose";
import Jobs from "../models/jobsModel.js";
import Users from "../models/userModel.js";
import { sendStatusUpdateEmail } from "./sendMailController.js";
import cache from "../utils/cache.js";
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

    // Create application with screening answers and cvUrl
    const newApplication = await Application.create({
      job,
      company,
      applicant,
      cvUrl, // Store the resume URL for this specific application
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
    const jobId = req.params.jobid;
    const {
      keywords,
      locations,
      status,
      designations,
      totalYearsInConsulting,
      screeningFilters,
    } = req.query;

    let screeningFiltersParsed = null;

    const cacheKey = `apps:${jobId}:${status || "all"}:${keywords || ""}:${
      locations || ""
    }:${designations || ""}:${totalYearsInConsulting || ""}:${
      screeningFilters || ""
    }`;

    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      console.log("🟢 Cache hit:", cacheKey);
      return res.status(200).json(cachedData);
    }

    // Build optimized aggregation pipeline
    const pipeline = [];

    // Initial match stage - filter by job ID (most selective filter first)
    const matchStage = {
      job: new mongoose.Types.ObjectId(jobId),
    };

    if (status) {
      matchStage.status = status;
    }

    pipeline.push({ $match: matchStage });

    // Apply text-based filters EARLY to reduce dataset size before expensive lookups
    const earlyFilterConditions = [];

    // Parse and prepare filters
    let keywordsList = [];
    let locationsList = [];
    let designationsList = [];

    if (keywords && keywords.trim()) {
      try {
        keywordsList = JSON.parse(keywords);
        if (!Array.isArray(keywordsList)) {
          keywordsList = [keywordsList];
        }
      } catch (e) {
        keywordsList = keywords
          .split(",")
          .map((k) => k.trim())
          .filter((k) => k);
      }
    }

    if (locations && locations.trim()) {
      try {
        locationsList = JSON.parse(locations);
        if (!Array.isArray(locationsList)) {
          locationsList = [locationsList];
        }
      } catch (e) {
        locationsList = locations
          .split(",")
          .map((loc) => loc.trim())
          .filter((loc) => loc);
      }
    }

    if (designations && designations.trim()) {
      try {
        designationsList = JSON.parse(designations);
        if (!Array.isArray(designationsList)) {
          designationsList = [designationsList];
        }
      } catch (e) {
        designationsList = designations
          .split(",")
          .map((des) => des.trim())
          .filter((des) => des);
      }
    }

    // Parse screening filters early
    if (screeningFilters && screeningFilters.trim()) {
      try {
        screeningFiltersParsed =
          typeof screeningFilters === "string"
            ? JSON.parse(screeningFilters)
            : screeningFilters;

        if (
          screeningFiltersParsed &&
          typeof screeningFiltersParsed === "object" &&
          Object.keys(screeningFiltersParsed).length > 0
        ) {
          Object.entries(screeningFiltersParsed).forEach(
            ([questionId, filterValues]) => {
              if (
                !filterValues ||
                (Array.isArray(filterValues) && filterValues.length === 0)
              ) {
                return;
              }

              const valuesArray = Array.isArray(filterValues)
                ? filterValues
                : [filterValues];
              if (valuesArray.length === 0) return;

              const screeningConditions = [];

              valuesArray.forEach((value) => {
                if (typeof value === "boolean") {
                  screeningConditions.push({
                    screeningAnswers: {
                      $elemMatch: {
                        questionId: new mongoose.Types.ObjectId(questionId),
                        $or: [
                          { answer: value },
                          { answer: value ? "Yes" : "No" },
                          {
                            answerText: value
                              ? /^(yes|true)$/i
                              : /^(no|false)$/i,
                          },
                        ],
                      },
                    },
                  });
                } else if (typeof value === "string") {
                  const textRegex = new RegExp(value, "i");
                  screeningConditions.push({
                    screeningAnswers: {
                      $elemMatch: {
                        questionId: new mongoose.Types.ObjectId(questionId),
                        $or: [
                          { answer: value },
                          { answer: textRegex },
                          { answerText: textRegex },
                        ],
                      },
                    },
                  });
                }
              });

              if (screeningConditions.length > 0) {
                earlyFilterConditions.push({ $or: screeningConditions });
              }
            }
          );
        }
      } catch (error) {
        console.error("Error parsing screening filters:", error);
        return res.status(400).json({
          success: false,
          message: "Invalid screening filter format: " + error.message,
        });
      }
    }

    // Apply early filters to reduce dataset before lookups
    if (earlyFilterConditions.length > 0) {
      pipeline.push({
        $match: {
          $and: earlyFilterConditions,
        },
      });
    }

    // Optimized lookup stages with minimal projections
    pipeline.push(
      {
        $lookup: {
          from: "users",
          localField: "applicant",
          foreignField: "_id",
          as: "applicant",
          pipeline: [
            {
              $project: {
                // Only project fields that are actually used
                firstName: 1,
                lastName: 1,
                email: 1,
                contactNumber: 1,
                profileUrl: 1,
                cvUrl: 1,
                currentDesignation: 1,
                currentCompany: 1,
                currentSalary: 1,
                currentLocation: 1,
                preferredLocations: 1,
                totalYearsInConsulting: 1,
                lastConsultingCompany: 1,
                isItConsultingCompany: 1,
                skills: 1,
                experience: 1,
                experienceHistory: 1,
                about: 1,
                expectedMinSalary: 1,
                preferredWorkTypes: 1,
                preferredWorkModes: 1,
                openToRelocate: 1,
                joinConsulting: 1,
                highestQualification: 1,
                linkedinLink: 1,
                dateOfBirth: 1,
                accountType: 1,
                isEmailVerified: 1,
                createdAt: 1,
                updatedAt: 1,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "jobs",
          localField: "job",
          foreignField: "_id",
          as: "job",
        },
      },
      {
        $lookup: {
          from: "companies",
          localField: "company",
          foreignField: "_id",
          as: "company",
          pipeline: [{ $project: { password: 0 } }],
        },
      }
    );

    // Unwind the populated fields
    pipeline.push(
      { $unwind: "$applicant" },
      { $unwind: "$job" },
      { $unwind: "$company" }
    );

    // Apply remaining filters after lookups
    const postLookupFilters = [];

    // Keywords filter
    if (keywordsList.length > 0) {
      const allKeywordConditions = [];

      keywordsList.forEach((keyword) => {
        const keywordRegex = new RegExp(keyword, "i");
        allKeywordConditions.push(
          { "applicant.currentDesignation": keywordRegex },
          { "applicant.currentCompany": keywordRegex },
          { "applicant.lastConsultingCompany": keywordRegex },
          {
            "applicant.skills": {
              $elemMatch: { $regex: keyword, $options: "i" },
            },
          },
          { "applicant.about": keywordRegex },
          { "applicant.firstName": keywordRegex },
          { "applicant.lastName": keywordRegex },
          { "applicant.email": keywordRegex },
          { "applicant.currentLocation": keywordRegex },
          {
            "applicant.preferredLocations": {
              $elemMatch: { $regex: keyword, $options: "i" },
            },
          },
          { "applicant.highestQualification": keywordRegex },
          { "applicant.experienceHistory.jobTitle": keywordRegex },
          { "applicant.experienceHistory.companyName": keywordRegex },
          { "applicant.experienceHistory.description": keywordRegex }
        );
      });

      postLookupFilters.push({ $or: allKeywordConditions });
    }

    // Locations filter
    if (locationsList.length > 0) {
      const locationRegexes = locationsList.map((loc) => new RegExp(loc, "i"));
      postLookupFilters.push({
        $or: [
          { "applicant.currentLocation": { $in: locationRegexes } },
          {
            "applicant.preferredLocations": {
              $elemMatch: { $in: locationRegexes },
            },
          },
        ],
      });
    }

    // Designations filter
    if (designationsList.length > 0) {
      const designationConditions = [];
      designationsList.forEach((designation) => {
        const designationRegex = new RegExp(designation, "i");
        designationConditions.push(
          { "applicant.currentDesignation": designationRegex },
          { "applicant.experienceHistory.jobTitle": designationRegex }
        );
      });
      postLookupFilters.push({ $or: designationConditions });
    }

    // Total years in consulting filter
    if (totalYearsInConsulting) {
      const experienceRanges = totalYearsInConsulting.split(",");
      const expConditions = [];

      experienceRanges.forEach((range) => {
        if (range.includes("-")) {
          const [min, max] = range.split("-").map(Number);
          if (!isNaN(min) && !isNaN(max)) {
            if (max === 100) {
              expConditions.push({
                "applicant.totalYearsInConsulting": { $gte: min },
              });
            } else {
              expConditions.push({
                "applicant.totalYearsInConsulting": { $gte: min, $lt: max },
              });
            }
          }
        } else {
          const exactYears = Number(range);
          if (!isNaN(exactYears)) {
            expConditions.push({
              "applicant.totalYearsInConsulting": exactYears,
            });
          }
        }
      });

      if (expConditions.length > 0) {
        postLookupFilters.push({ $or: expConditions });
      }
    }

    // Apply post-lookup filters
    if (postLookupFilters.length > 0) {
      pipeline.push({
        $match: {
          $and: postLookupFilters,
        },
      });
    }

    // Sort by creation date (newest first)
    pipeline.push({ $sort: { createdAt: -1 } });

    // Execute aggregation
    const applications = await Application.aggregate(pipeline);

    const responseData = {
      success: true,
      applications,
      totalApplications: applications.length,
      filters: {
        keywords,
        locations,
        designations,
        totalYearsInConsulting,
        screeningFilters: screeningFiltersParsed,
      },
    };

    // ✅ STEP 4: Store in cache
    cache.set(cacheKey, responseData);

    // ✅ STEP 5: Send response
    return res.status(200).json(responseData);
  } catch (error) {
    console.error("Error in getApplicationsOfAjob:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Server Error while fetching applications",
    });
  }
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
