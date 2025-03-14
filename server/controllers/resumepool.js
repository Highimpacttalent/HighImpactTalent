import ResumePool from "../models/ResumePool.js";  

export const getResumes = async (req, res, next) => {
  try {
    const { search, location, exp, skills, pastCompanies, jobRoles } = req.body; 

    let queryObject = {};

    // Filter by location (only if location is not an empty string)
    if (location?.trim()) {
      queryObject.location = { $regex: location, $options: "i" };
    }

    // Filter by experience (only if exp is a valid number)
    if (exp && !isNaN(exp)) {
      queryObject.experience = { $gt: Number(exp) };
    }

    // Filter by skills (must include all provided skills)
    if (skills?.length) {
      queryObject.skills = { $all: skills };
    }

    // Filter by past companies (only if pastCompanies is not empty)
    if (pastCompanies?.trim()) {
      queryObject.companies = { $in: [pastCompanies] }; 
    }

    // Search by name, email, or past companies
    if (search?.trim()) {
      queryObject.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { companies: { $regex: search, $options: "i" } },
      ];
    }

    // Filter by job roles (substring match for each role in the array)
    if (jobRoles?.trim()) {
      queryObject.jobRoles = {
        $elemMatch: {
          $regex: jobRoles,
          $options: "i",
        },
      };
    } else if(jobRoles?.length){
      // Exclude records with empty jobRoles array
      queryObject.jobRoles = { $exists: true, $not: { $size: 0 } };
    }

    // Always sort resumes by rating (highest first)
    const resumes = await ResumePool.find(queryObject).sort("-rating");

    res.status(200).json({
      success: true,
      totalResumes: resumes.length,
      data: resumes,
    });
  } catch (error) {
    next(error);
  }
};
