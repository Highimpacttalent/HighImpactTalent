import Application from "../models/ApplicationModel.js"; // Adjust the path as necessary
import mongoose from "mongoose";
import Jobs from "../models/jobsModel.js";
import Users from "../models/userModel.js";

// Create a new application
export const createApplication = async (req, res) => {
  try {
    const { job, company, applicant, status } = req.body;
    console.log(job, company, applicant, status)
    const newApplication = await Application.create({
      job,
      company,
      applicant,
      status: status || "applied",
    });
    const isAlreadyApplied = await Application.findOne({applicant,job})
    if(isAlreadyApplied){
      return res.status(400).json({
        success:false,
        message:'You have already applied for this job.'
      })
    }
    const user = await Users.findByIdAndUpdate(
      { _id: applicant },
      { $push: { appliedJobs: newApplication._id } }
    );
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Applicant not found",
      });
    }
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
      message: "success",
      newApplication,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
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

//update status
export const updateApplicationStatus = async (req, res) => {
  const { status } = req.body;

  try {
    const companyId = req.body.user.userId;
    let application = await Application.findById(req.params.id);

    if (companyId != application.company) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to update status",
      });
    }
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.status = status;
    application = await application.save();

    res.status(201).json({
      success: true,
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
