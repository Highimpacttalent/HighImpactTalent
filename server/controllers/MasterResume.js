import MasterResume from  "../models/MasterResume.js";
import mongoose from "mongoose";

// Helper to split comma-separated skills string into an array
const parseSkillsString = (skillsString) => {
  if (!skillsString) return [];
  // Split by comma, trim whitespace, and filter out empty strings
  return skillsString.split(',').map(s => s.trim()).filter(s => s);
};

export const createOrUpdateMasterResume = async (req, res) => {
  try {
    const {
        user_id, // Expect user_id here
        personalInfo,
        careerSummary,
        education,
        workExperience,
        projects,
        skills, // This is the single string from the form
        achievements,
        awards,
        volunteer
    } = req.body;

    // Basic validation for user_id presence
    if (!user_id) {
      return res.status(400).json({ message: 'User ID is required in the request body' });
    }

     // Basic validation for user_id format
     if (!mongoose.Types.ObjectId.isValid(user_id)) {
        return res.status(400).json({ message: 'Invalid User ID format' });
    }


    // Map the incoming form data structure keys to the schema structure keys
    // Ensure nested objects exist even if empty, to avoid Mongoose issues with undefined paths on $set
    const mappedData = {
      personalInformation: personalInfo || {}, // Map and ensure it's an object
      professionalDetails: { // Map from careerSummary and add placeholder for others
        shortSummary: careerSummary?.shortSummary,
        detailedObjective: careerSummary?.detailedObjective,
        // Note: Fields like noOfYearsExperience, currentCompany, etc.,
        // from the example schema are not in the form, so they are not mapped here.
        // They will take their default/optional values if not provided in req.body.
      },
      education: education || [], // Map 'education' array to 'educationDetails' and ensure it's an array
      workExperience: workExperience || [], // Direct map and ensure it's an array
      projects: projects || [], // Direct map and ensure it's an array
      skills: parseSkillsString(skills), // Convert comma-separated string to array
      achievements: achievements || [], // Direct map and ensure it's an array
      awards: awards || [],             // Direct map and ensure it's an array
      volunteer: volunteer || [],       // Direct map and ensure it's an array
    };

    // Find an existing resume for the user_id or create a new one (upsert)
    const resume = await MasterResume.findOneAndUpdate(
      { user_id: user_id }, 
      { $set: mappedData }, 
      {
        new: true, // Return the updated/created document
        upsert: true, // Create the document if it doesn't exist
        runValidators: true 
      }
    );

    // Determine if a new document was created vs. an existing one updated
    // Check if createdAt and updatedAt are the same time (upserted document will have identical timestamps initially)
    const status = resume.createdAt.getTime() === resume.updatedAt.getTime() ? 201 : 200;
    const message = status === 201 ? 'Master Resume created successfully' : 'Master Resume updated successfully';

    res.status(status).json({ message: message, resume: resume });

  } catch (error) {
    console.error('Error saving/updating master resume:', error);

    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: 'Validation Error', errors: messages });
    }

     // Handle Mongoose duplicate key errors (e.g., unique: true constraints)
    if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0]; // Get the field name causing the duplicate
        // Provide a specific message if the duplicate is on the user_id field (unique constraint)
         if (field === 'user_id') {
             // Although upsert handles this, this catch might trigger if upsert fails for some other reason
             // or if unique is applied elsewhere like email *across* all resumes instead of per user
             return res.status(400).json({
                 message: `A master resume profile already exists for this user.`,
                 field: field
             });
         }
         // Handle other potential unique fields if needed (like email if unique constraint is applied to it)
        const value = error.keyValue[field]; // Get the duplicate value
        return res.status(400).json({
            message: `Duplicate value found for field '${field}': '${value}'. Please use a different value.`,
            field: field
        });
    }


    // Handle other potential errors
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const getMasterResumeByUserId = async (req, res) => {
  try {
    const {userId} = req.body;

    // Validate the user_id format before querying
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid User ID format' });
    }

    // Find the resume by user_id
    const resume = await MasterResume.findOne({ user_id: userId });

    // If no resume is found for this user ID
    if (!resume) {
      return res.status(404).json({ message: 'Master Resume not found for this user ID' });
    }

    // Return the found resume
    res.status(200).json(resume);

  } catch (error) {
    console.error('Error fetching master resume:', error);

     // Handle Mongoose CastError specifically (e.g., if the provided ID format is invalid)
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
        return res.status(400).json({ message: 'Invalid User ID format' });
    }
    // Handle other potential errors
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};