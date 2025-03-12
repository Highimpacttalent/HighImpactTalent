import ResumePool from "../models/ResumePool.js";

export const getResumes = async (req, res, next) => {
  try {
    const { search, location, exp, skills, pastCompanies } = req.body;
    
    let queryObject = {};
    
    // Filter by location (case-insensitive and partial matching)
    if (location) {
      queryObject.location = { $regex: location, $options: "i" };
    }
    
    // Filter by experience (greater than the provided value)
    if (exp) {
      queryObject.experience = { $gt: Number(exp) };
    }
    
    // Filter by skills (case-insensitive and partial matching for each skill)
    if (skills?.length) {
      // Convert skills array to regex patterns for partial matching
      const skillPatterns = skills.map(skill => new RegExp(skill, "i"));
      queryObject.skills = { $in: skillPatterns };
    }
    
    // Filter by past companies (case-insensitive and partial matching)
    if (pastCompanies?.length) {
      // Create an array of regex patterns for each company name
      const companyPatterns = pastCompanies.map(company => new RegExp(company, "i"));
      queryObject.companies = { $in: companyPatterns };
    }
    
    // Search by name, email, or past companies (case-insensitive and partial matching)
    if (search) {
      queryObject.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { companies: { $regex: search, $options: "i" } },
      ];
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