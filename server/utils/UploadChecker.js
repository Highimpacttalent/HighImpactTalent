import { uploadFileToS3 } from "../s3Config/s3.js";
import xlsx from "xlsx";

// Helper to flatten one ResumePool document into a flat object
function flattenResume(entry) {
  // stringify _id
  const id = entry._id?.toString?.() || entry._id;

  // personalInformation
  const pi = entry.personalInformation || {};
  const name            = pi.name || "";
  const email           = pi.email || "";
  const contactNumber   = pi.contactNumber || "";
  const linkedinLink    = pi.linkedinLink || "";
  const dateOfBirth     = pi.dateOfBirth || "";
  const location        = pi.location || "";

  // professionalDetails
  const pd = entry.professionalDetails || {};
  const yearsExp               = pd.noOfYearsExperience ?? "";
  const currentCompany         = pd.currentCompany || "";
  const currentDesignation     = pd.currentDesignation || "";
  const salary                 = pd.salary || "";
  const about                  = pd.about || "";
  const hasConsultingBackground= pd.hasConsultingBackground ?? "";

  // educationDetails: array of objects → semicolon-joined JSON strings
  const educationDetails = Array.isArray(entry.educationDetails)
    ? entry.educationDetails.map(ed => 
        `${ed.instituteName||""} (${ed.yearOfPassout||""})`
      ).join("; ")
    : "";

  // workExperience: array → semicolon-joined summaries
  const workExperience = Array.isArray(entry.workExperience)
    ? entry.workExperience.map(we => 
        `${we.companyName||""} | ${we.jobTitle||""} | ${we.duration||""}`
      ).join("; ")
    : "";

  // skills, companiesWorkedAt, jobRoles: arrays → semicolon-joined
  const skills            = Array.isArray(entry.skills)            ? entry.skills.join("; ")            : "";
  const companiesWorkedAt = Array.isArray(entry.companiesWorkedAt) ? entry.companiesWorkedAt.join("; ") : "";
  const jobRoles          = Array.isArray(entry.jobRoles)          ? entry.jobRoles.join("; ")          : "";

  // other top-level flags
  const topCompanies  = entry.topCompanies ?? "";
  const topInstitutes = entry.topInstitutes ?? "";

  // URLs & versioning
  const cvUrl   = entry.cvUrl || "";
  const v       = entry.__v ?? "";

  // timestamps
  const createdAt = entry.createdAt 
    ? (entry.createdAt.toISOString 
        ? entry.createdAt.toISOString() 
        : entry.createdAt.$date || "") 
    : "";
  const updatedAt = entry.updatedAt 
    ? (entry.updatedAt.toISOString 
        ? entry.updatedAt.toISOString() 
        : entry.updatedAt.$date || "") 
    : "";

  return {
    _id: id,
    name,
    email,
    contactNumber,
    linkedinLink,
    dateOfBirth,
    location,
    yearsExp,
    currentCompany,
    currentDesignation,
    salary,
    about,
    hasConsultingBackground,
    educationDetails,
    workExperience,
    skills,
    companiesWorkedAt,
    jobRoles,
    topCompanies,
    topInstitutes,
    cvUrl,
    createdAt,
    updatedAt,
    __v: v
  };
}


export async function uploadJsonAsCsvToS3(data, folder = "") {
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("No data provided for CSV upload");
  }

  // 1. stringify _id & flatten
  const flatData = data.map(d => flattenResume({
    ...d,
    _id: d._id?.toString?.() || d._id
  }));

  // 2. log first 5 so you can verify
  console.log("First 5 entries to be uploaded as CSV:", flatData.slice(0, 5));

  // 3. convert to sheet & CSV
  const worksheet = xlsx.utils.json_to_sheet(flatData);
  const csvString = xlsx.utils.sheet_to_csv(worksheet);

  const csvBuffer = Buffer.from(csvString, "utf8");
  const timestamp = Date.now();
  const key = `${folder.replace(/\/?$/, "")}/data-${timestamp}.csv`;

  const s3Response = await uploadFileToS3(csvBuffer, key, "text/csv");
  return s3Response.Location;
}