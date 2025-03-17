import ResumePool from "../models/ResumePool.js";  

export const getResumes = async (req, res, next) => {
  try {
    const { search, location, exp, skills, pastCompanies, jobRoles } = req.body; 

    let queryObject = {};

    // Filter by location (only if location is provided)
    if (location?.trim()) {
      queryObject.location = { $regex: location, $options: "i" };
    }

    // Filter by experience (only if exp is a valid number)
    if (exp && !isNaN(exp)) {
      queryObject.experience = { $gt: Number(exp) };
    }

    // Filter by multiple skills (AND condition)
    if (skills?.length) {
      queryObject.skills = { $all: skills }; 
    }

    // Filter by multiple past companies (OR condition)
    if (pastCompanies && pastCompanies.length > 0) {
      queryObject.companies = { $in: pastCompanies }; 
    }

    // Filter by job roles (only if jobRoles is not an empty string)
    if (jobRoles?.trim()) {
      queryObject.jobRoles = {
        $elemMatch: {
          $regex: jobRoles,
          $options: "i",
        },
      };
    }

    // Search by name, email, or past companies
    if (search?.trim()) {
      queryObject.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { companies: { $regex: search, $options: "i" } },
      ];
    }

    // Sort resumes by rating
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
