import ResumePool from "../models/ResumePool.js";  

export const getResumes = async (req, res, next) => {
  try {
    const { search, location, exp, skills, pastCompanies } = req.body; // Added pastCompanies to req.body

    let queryObject = {};

    // Filter by location (case-insensitive)
    if (location) {
      queryObject.location = { $regex: location, $options: "i" };
    }

    // Filter by experience (greater than the provided value)
    if (exp) {
      queryObject.experience = { $gt: Number(exp) };
    }

    // Filter by skills (must include all provided skills)
    if (skills?.length) {
      queryObject.skills = { $all: skills };
    }

    // Filter by past companies (matches at least one provided company)
    if (pastCompanies?.length) {
      queryObject.companies = { $in: pastCompanies };
    }

    // Search by name, email, or past companies
    if (search) {
      queryObject.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { companies: { $regex: search, $options: "i" } }, // Search past companies as well
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