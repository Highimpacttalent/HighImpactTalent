import Application from "../models/ApplicationModel.js"; // Adjust the path as necessary
import mongoose from "mongoose";
import Jobs from "../models/jobsModel.js";
import Users from "../models/userModel.js";
import { sendStatusUpdateEmail } from "./sendMailController.js";
import { uploadFileToS3 } from "../s3Config/s3.js";
import multer from "multer";

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

// update status
export const updateApplicationStatus = async (req, res) => {
  const { status } = req.body;

  try {
    const companyId = req.body.user.userId;
    let application = await Application.findById(req.params.id)
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
      location,
      status,
      currentDesignation,
      totalYearsInConsulting,
      screeningFilters,
      page = 1,
      limit = 20,
    } = req.query;

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    let screeningFiltersParsed = null;

    // DEBUGGING: Log all incoming parameters
    console.log("=== DEBUGGING FILTERS ===");
    console.log("Job ID:", jobId);
    console.log("Raw Query Params:", req.query);
    console.log("Keywords:", keywords);
    console.log("Location:", location);
    console.log("Status:", status);
    console.log("Current Designation:", currentDesignation);
    console.log("Total Years in Consulting:", totalYearsInConsulting);
    console.log("Screening Filters (raw):", screeningFilters);
    console.log("========================");

    // Build aggregation pipeline
    const pipeline = [];

    // Initial match stage - filter by job ID
    const matchStage = {
      job: new mongoose.Types.ObjectId(jobId),
    };

    if (status) {
      matchStage.status = status; 
    }

    pipeline.push({ $match: matchStage });

    // Lookup stages for population
    pipeline.push(
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
      },
      {
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
      }
    );

    // Unwind the populated fields
    pipeline.push(
      { $unwind: "$job" },
      { $unwind: "$company" },
      { $unwind: "$applicant" }
    );

    // Apply filters using $match stages
    const filterConditions = [];

    // FIXED: Keywords filter - handle both array and string from frontend
    if (keywords && keywords.trim()) {
      console.log("Processing keywords:", keywords);
      
      // Handle keywords sent as comma-separated string OR array
      let keywordsList;
      try {
        // Try to parse as JSON array first (in case frontend sends array)
        keywordsList = JSON.parse(keywords);
        if (!Array.isArray(keywordsList)) {
          keywordsList = [keywordsList];
        }
      } catch (e) {
        // If not JSON, treat as comma-separated string
        keywordsList = keywords.split(",").map(k => k.trim()).filter(k => k);
      }

      console.log("Keywords list:", keywordsList);

      if (keywordsList.length > 0) {
        const keywordConditions = keywordsList.map((keyword) => {
          const keywordRegex = new RegExp(keyword, "i");
          return {
            $or: [
              { "applicant.currentDesignation": keywordRegex },
              { "applicant.currentCompany": keywordRegex },
              { "applicant.skills": { $elemMatch: { $regex: keyword, $options: "i" } } },
              { "applicant.about": keywordRegex },
              { "applicant.firstName": keywordRegex },
              { "applicant.lastName": keywordRegex },
            ],
          };
        });

        const keywordFilter = {
          $or: keywordConditions,
        };
        
        console.log("Keyword filter condition:", JSON.stringify(keywordFilter, null, 2));
        filterConditions.push(keywordFilter);
      }
    }

    // Location filter
    if (location && location.trim()) {
      console.log("Processing location:", location);
      
      const locationsList = location
        .split(",")
        .map((loc) => loc.trim())
        .filter((loc) => loc);

      console.log("Locations list:", locationsList);

      if (locationsList.length > 0) {
        const locationRegexes = locationsList.map(
          (loc) => new RegExp(loc, "i")
        );

        const locationFilter = {
          $or: [
            { "applicant.currentLocation": { $in: locationRegexes } },
            {
              "applicant.preferredLocations": {
                $elemMatch: { $in: locationRegexes },
              },
            },
          ],
        };
        
        console.log("Location filter condition:", JSON.stringify(locationFilter, null, 2));
        filterConditions.push(locationFilter);
      }
    }

    // Current designation filter
    if (currentDesignation && currentDesignation.trim()) {
      console.log("Processing current designation:", currentDesignation);
      
      const designationsList = currentDesignation
        .split(",")
        .map((des) => des.trim())
        .filter((des) => des);

      if (designationsList.length > 0) {
        const designationRegexes = designationsList.map(
          (des) => new RegExp(des, "i")
        );
        
        const designationFilter = {
          "applicant.currentDesignation": { $in: designationRegexes },
        };
        
        console.log("Designation filter condition:", JSON.stringify(designationFilter, null, 2));
        filterConditions.push(designationFilter);
      }
    }

    // Total years in consulting filter
    if (totalYearsInConsulting) {
      console.log("Processing years in consulting:", totalYearsInConsulting);
      
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
        const experienceFilter = { $or: expConditions };
        console.log("Experience filter condition:", JSON.stringify(experienceFilter, null, 2));
        filterConditions.push(experienceFilter);
      }
    }

    // COMPLETELY REWRITTEN: Screening Filters to match your actual data model
    if (screeningFilters && screeningFilters.trim()) {
      console.log("Processing screening filters:", screeningFilters);
      
      try {
        screeningFiltersParsed =
          typeof screeningFilters === "string"
            ? JSON.parse(screeningFilters)
            : screeningFilters;

        console.log("Parsed screening filters:", screeningFiltersParsed);

        if (
          screeningFiltersParsed &&
          typeof screeningFiltersParsed === "object" &&
          Object.keys(screeningFiltersParsed).length > 0
        ) {
          console.log("Processing screening filter entries...");
          
          Object.entries(screeningFiltersParsed).forEach(
            ([questionId, filterValue]) => {
              console.log(`Processing question ${questionId}:`, filterValue);
              
              // Skip empty values
              if (!filterValue || (Array.isArray(filterValue) && filterValue.length === 0)) {
                return;
              }

              // Create filter condition based on the answer value
              let screeningCondition;

              if (Array.isArray(filterValue)) {
                // For multi-choice or multiple acceptable answers
                screeningCondition = {
                  screeningAnswers: {
                    $elemMatch: {
                      questionId: new mongoose.Types.ObjectId(questionId),
                      $or: [
                        { answer: { $in: filterValue } },
                        { answerText: { $in: filterValue.map(val => new RegExp(val, "i")) } }
                      ]
                    },
                  },
                };
              } else if (typeof filterValue === "string") {
                // For text answers or single choice
                const textRegex = new RegExp(filterValue, "i");
                screeningCondition = {
                  screeningAnswers: {
                    $elemMatch: {
                      questionId: new mongoose.Types.ObjectId(questionId),
                      $or: [
                        { answer: filterValue },
                        { answer: textRegex },
                        { answerText: textRegex }
                      ]
                    },
                  },
                };
              } else if (typeof filterValue === "boolean") {
                // For yes/no questions
                screeningCondition = {
                  screeningAnswers: {
                    $elemMatch: {
                      questionId: new mongoose.Types.ObjectId(questionId),
                      $or: [
                        { answer: filterValue },
                        { answer: filterValue ? "Yes" : "No" },
                        { answerText: filterValue ? /^(yes|true)$/i : /^(no|false)$/i }
                      ]
                    },
                  },
                };
              }

              if (screeningCondition) {
                console.log("Screening filter condition:", JSON.stringify(screeningCondition, null, 2));
                filterConditions.push(screeningCondition);
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

    // DEBUGGING: Log all filter conditions before applying
    console.log("=== FINAL FILTER CONDITIONS ===");
    console.log("Total filter conditions:", filterConditions.length);
    filterConditions.forEach((condition, index) => {
      console.log(`Filter ${index + 1}:`, JSON.stringify(condition, null, 2));
    });
    console.log("================================");

    // Apply all filter conditions
    if (filterConditions.length > 0) {
      const finalMatchStage = {
        $match: {
          $and: filterConditions,
        },
      };
      console.log("Final match stage:", JSON.stringify(finalMatchStage, null, 2));
      pipeline.push(finalMatchStage);
    } else {
      console.log("No filter conditions applied");
    }

    // Add sorting
    pipeline.push({ $sort: { createdAt: -1 } });

    // Use facet for parallel count and data retrieval
    pipeline.push({
      $facet: {
        data: [{ $skip: skip }, { $limit: limitNum }],
        count: [{ $count: "total" }],
      },
    });

    // Log the complete pipeline for debugging
    console.log("=== COMPLETE AGGREGATION PIPELINE ===");
    console.log(JSON.stringify(pipeline, null, 2));
    console.log("====================================");

    // Execute aggregation
    const [result] = await Application.aggregate(pipeline);
    const applications = result.data || [];
    const totalApplications = result.count[0]?.total || 0;
    const numOfPage = Math.ceil(totalApplications / limitNum);

    console.log("=== RESULTS ===");
    console.log("Applications found:", applications.length);
    console.log("Total applications:", totalApplications);
    console.log("===============");

    if (totalApplications === 0) {
      return res.status(200).json({
        success: true,
        message: "No applications found matching the criteria",
        applications: [],
        totalApplications: 0,
        page: pageNum,
        numOfPage: 0,
        filters: {
          keywords,
          location,
          currentDesignation,
          totalYearsInConsulting,
          screeningFilters: screeningFiltersParsed,
        },
      });
    }

    res.status(200).json({
      success: true,
      applications,
      totalApplications,
      page: pageNum,
      numOfPage,
      filters: {
        keywords,
        location,
        currentDesignation,
        totalYearsInConsulting,
        screeningFilters: screeningFiltersParsed,
      },
    });
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
              { label: "No", value: "No" }
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
          const yesAnswers = group.uniqueAnswers.filter(ans => {
            if (typeof ans === 'string') return ans.toLowerCase() === 'yes';
            return false;
          });
          
          const noAnswers = group.uniqueAnswers.filter(ans => {
            if (typeof ans === 'string') return ans.toLowerCase() === 'no';
            return false;
          });
          
          filterOptions[questionId].statistics = {
            yesCount: yesAnswers.length,
            noCount: noAnswers.length,
            totalResponses: yesAnswers.length + noAnswers.length
          };
          
          // ALWAYS ensure Yes/No options are available - don't rely on job definition
          filterOptions[questionId].availableAnswers = [
            { label: "Yes", value: "Yes" },
            { label: "No", value: "No" }
          ];
        }
        // For other question types, we might want to add additional info
        else if (group.questionType === "short_answer" || group.questionType === "long_answer") {
          filterOptions[questionId].sampleAnswers = group.answerTexts ? group.answerTexts.slice(0, 3) : [];
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
              { label: "No", value: "No" }
            ];
            
            // Add statistics if we have actual answers
            const yesAnswers = group.uniqueAnswers.filter(ans => {
              if (typeof ans === 'string') return ans.toLowerCase() === 'yes';
              return false;
            });
            
            const noAnswers = group.uniqueAnswers.filter(ans => {
              if (typeof ans === 'string') return ans.toLowerCase() === 'no';
              return false;
            });
            
            filterOptions[questionId].statistics = {
              yesCount: yesAnswers.length,
              noCount: noAnswers.length,
              totalResponses: yesAnswers.length + noAnswers.length
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
            filterOptions[questionId].sampleAnswers = group.answerTexts ? group.answerTexts.slice(0, 3) : [];
            break;
        }
      }
    });

    // Final check: Ensure ALL yes/no questions have availableAnswers (most important part!)
    Object.keys(filterOptions).forEach(questionId => {
      if (filterOptions[questionId].questionType === "yes/no") {
        // FORCE Yes/No options for all yes/no questions regardless of any other logic
        filterOptions[questionId].availableAnswers = [
          { label: "Yes", value: "Yes" },
          { label: "No", value: "No" }
        ];
      }
    });

    console.log("Filter options for debugging:", JSON.stringify(filterOptions, null, 2));
    console.log("Job Screening Questions:", job.screeningQuestions);
    console.log("Total Questions:", Object.keys(filterOptions).length);

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

// Add this to your backend controller file
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
    const pipeline = [
      {
        $match: {
          job: new mongoose.Types.ObjectId(jobId),
        },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          status: "$_id",
          count: 1,
          _id: 0,
        },
      },
    ];

    const counts = await Application.aggregate(pipeline);

    // Convert array to object with status as keys
    const stageCounts = {};
    counts.forEach((item) => {
      stageCounts[item.status] = item.count;
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
    const { applicationIds } = req.body;

    if (
      !applicationIds ||
      !Array.isArray(applicationIds) ||
      applicationIds.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid array of application IDs.",
      });
    }

    const applications = await Application.find({
      _id: { $in: applicationIds },
    })
      .populate("job") // Populating job details
      .populate("company");

    if (!applications || applications.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No applications found for the provided IDs.",
      });
    }

    res.status(200).json({
      success: true,
      applications,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
    res.status(500).send("Server error");
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