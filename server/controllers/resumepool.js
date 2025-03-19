import ResumePool from "../models/ResumePool.js";

const convertToBoolean = (value) => value === "true" || value === true;

const calculateExperience = (dateRange) => {
  if (!dateRange || !dateRange.includes(" - ")) return 0;

  const [start, end] = dateRange.split(" - ").map((d) => d.trim());
  
  const startDate = new Date(`1 ${start}`);
  const endDate = end.toLowerCase().includes("present") ? new Date() : new Date(`1 ${end}`);

  if (isNaN(startDate) || isNaN(endDate)) return 0;

  const diffYears = (endDate - startDate) / (1000 * 60 * 60 * 24 * 365.25);
  return Math.max(0, parseFloat(diffYears.toFixed(1)));
};

export const getResumes = async (req, res, next) => {
  try {
    const {
      location,
      exp,
      currentCompany,
      isConsultant,
      instituteName,
      yearOfPassout,
      workExpCompany,
      minWorkExp,
      skills,
      topCompany,
      topInstitutes,
      companiesWorkedAt,
      jobRoles,
    } = req.body;

    let queryObject = {};

    // Convert Boolean values
    const consultantFlag = convertToBoolean(isConsultant);
    const topCompanyFlag = convertToBoolean(topCompany);
    const topInstitutesFlag = convertToBoolean(topInstitutes);
    console.log("Received yearOfPassout:", yearOfPassout);

    // Apply filters
    if (location?.trim()) {
      queryObject["personalInformation.location"] = { $regex: location, $options: "i" };
    }

    if (exp && !isNaN(exp)) {
      queryObject["professionalDetails.noOfYearsExperience"] = { $gte: Number(exp) };
    }

    if (currentCompany?.trim()) {
      queryObject["professionalDetails.currentCompany"] = { $regex: currentCompany, $options: "i" };
    }

    if (consultantFlag) {
      queryObject["professionalDetails.hasConsultingBackground"] = true;
    }

    if (skills?.length) {
      queryObject.skills = { $all: skills };
    }

    if (instituteName?.trim() && yearOfPassout) {
      queryObject["educationDetails"] = {
        $elemMatch: {
          instituteName: { $regex: instituteName, $options: "i" },
          yearOfPassout: Number(yearOfPassout)
        }
      };
    }
    

    if (topCompanyFlag) {
      queryObject.topCompanies = true;
    }

    if (topInstitutesFlag) {
      queryObject.topInstitutes = true;
    }

    if (companiesWorkedAt?.length) {
      queryObject.companiesWorkedAt = { $in: companiesWorkedAt };
    }

    if (jobRoles?.length) {
      queryObject.jobRoles = { $in: jobRoles };
    }

    let resumes = await ResumePool.find(queryObject).sort("-exp");

    if (workExpCompany?.trim() && minWorkExp) {
      resumes = resumes.filter((resume) =>
        resume.workExperience.some((exp) => {
          if (!exp.duration) return false;
          const calculatedYears = calculateExperience(exp.duration);
          return exp.companyName.match(new RegExp(workExpCompany, "i")) && calculatedYears >= Number(minWorkExp);
        })
      );
    }

    res.status(200).json({
      success: true,
      totalResumes: resumes.length,
      data: resumes,
    });
  } catch (error) {
    next(error);
  }
};

export const getResumeById = async (req, res, next) => {
  try {
    const { resumeId } = req.body;
    console.log(resumeId)

    const resume = await ResumePool.findById(resumeId);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    res.status(200).json({
      success: true,
      data: resume,
    });
  } catch (error) {
    next(error);
  }
};
