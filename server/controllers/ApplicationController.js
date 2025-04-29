import Application from "../models/ApplicationModel.js"; // Adjust the path as necessary
import mongoose from "mongoose";
import Jobs from "../models/jobsModel.js";
import Users from "../models/userModel.js";

// Create a new application
export const createApplication = async (req, res) => {
  try {
    const { job, company, applicant, screeningAnswers } = req.body;
    
    // Check if job exists
    const jobex = await Jobs.findById(job);
    if (!jobex) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }
    
    // Check if user exists
    const userex = await Users.findById(applicant);
    if (!userex) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    
    // Check if applicant meets experience requirements
    if (Number(jobex.experience) > Number(userex.experience)) {
      return res.status(400).json({
        success: false,
        message: 'You are not eligible for this job.',
      });
    }
    
    // Check if already applied
    const isAlreadyApplied = await Application.findOne({applicant, job});
    if(isAlreadyApplied){
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this job.'
      });
    }
    
    // Validate screening questions if they exist
    if (jobex.screeningQuestions && jobex.screeningQuestions.length > 0) {
      // Check if mandatory questions are answered
      for (const question of jobex.screeningQuestions) {
        if (question.isMandatory) {
          const answered = screeningAnswers && 
                          screeningAnswers.some(ans => 
                            ans.questionId.toString() === question._id.toString() && 
                            ans.answer && ans.answer.trim() !== '');
          
          if (!answered) {
            return res.status(400).json({
              success: false,
              message: `Mandatory screening question "${question.question}" must be answered.`
            });
          }
        }
      }
    }
    
    // Prepare screening answers with both question text and answer
    let formattedScreeningAnswers = [];
    if (screeningAnswers && screeningAnswers.length > 0) {
      // Filter out empty answers
      const validAnswers = screeningAnswers.filter(answer => 
        answer.answer && answer.answer.trim() !== ''
      );
      
      formattedScreeningAnswers = validAnswers.map(answer => {
        const question = jobex.screeningQuestions.find(
          q => q._id.toString() === answer.questionId.toString()
        );
        return {
          questionId: answer.questionId,
          question: question ? question.question : '',
          answer: answer.answer.trim()
        };
      });
    }
    
    // Create application with screening answers if provided
    const newApplication = await Application.create({
      job,
      company,
      applicant,
      screeningAnswers: formattedScreeningAnswers,
      statusHistory: [{ status: "Applied", changedAt: new Date() }]
    });
    
    // Update user's applied jobs
    const user = await Users.findByIdAndUpdate(
      { _id: applicant },
      { $push: { appliedJobs: newApplication._id } },
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
      user
    });
  } catch (error) {
    console.error("Error creating application:", error);
    res.status(400).json({ 
      success: false,
      message: error.message 
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
      data:application,
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
    let application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (companyId != application.company.toString()) {
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


//get all application of a job
export const getApplicationsOfAjob = async (req, res) => {
  const jobId = req.params.jobid;
  console.log(jobId);
  try {
    const applications = await Application.find({ job: jobId })
      .populate("job")
      .populate("company")
      .populate("applicant");

    if (!applications || applications.length === 0) {
      return res
        .status(404)
        .json({ message: "No applications found for this job" });
    }

    res.status(200).json({
      success: true,
      applications,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const  getallApplicationOfApplicant = async(req,res)=>{
  try {
    const id = req.params.applicantid;

    const userapplication = await Application.find({applicant:id}).populate("job")
    .populate("company")
    res.status(200).json({
      success:true,
      data:userapplication,
    })
  } catch (error) {
    console.log(error)  
    res.status(404).json({
      success:false,
    })
  }
}

export const getApplicationsWithJobs = async (req, res) => {
  try {
    const { applicationIds } = req.body;

    if (!applicationIds || !Array.isArray(applicationIds) || applicationIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid array of application IDs.",
      });
    }

    const applications = await Application.find({ _id: { $in: applicationIds } })
      .populate("job")  // Populating job details
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
  const { status,applicationId } = req.body;

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
    const application = await Application.findById(applicationId);

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


