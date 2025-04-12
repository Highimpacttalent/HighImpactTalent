import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {Box, Button, Typography} from "@mui/material"
import JobCardRecriter from "./components/JobCardR";

const JobPosted = () => {
  const { user } = useSelector((state) => state.user);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(
          "https://highimpacttalent.onrender.com/api-v1/companies/get-company-joblisting",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user?.token}`,
            },
            body: JSON.stringify({ id: user?._id }),
          }
        );
        const data = await response.json();
        if (data.success) {
          setJobs(data.companies.jobPosts);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  return (
    <Box sx={{bgcolor:"white",p:4}}>
        <Typography sx={{textAlign:"center",mt:2,color:"#24252C",fontFamily:"Satoshi",mb:4,fontWeight:700,fontSize:"30px"}}>Manage Your Job Posts</Typography>
        <Box sx={{width:"100%",display:"flex",alignItems:"center",justifyContent:"center",}}>
        <Button variant="contained" sx={{bgcolor:"#3C7EFC",py:2,px:4,borderRadius:50,fontFamily:"Satoshi",fontWeight:700,fontSize:"16px",textTransform:"none",mb:4}} onClick={()=>{navigate("/upload-a-job")}}>+ Post New Job</Button>
        </Box>
    <div className="flex flex-col md:flex-row h-screen text-gray-900">
      {/* Job List */}
      <div
        className={`md:w-1/2 transition-all ${
          selectedJob ? "md:w-1/2" : "md:w-full"
        } overflow-y-auto`}
      >
        {loading ? (
          <p className="text-center text-blue-600">Loading jobs...</p>
        ) : (
          jobs.map((job) => (
            <Box sx={{mb:2}}>
                <JobCardRecriter job={job} setSelectedJob={setSelectedJob} selectedJob={selectedJob}></JobCardRecriter>
            </Box>
          ))
        )}
      </div>

      {/* Job Description */}
      {selectedJob && (
  <div className="md:w-1/2 bg-white p-8 rounded-lg shadow-lg overflow-y-auto border-l-4 border-blue-600">
    {/* Job Title & Location */}
    <h2 className="text-3xl font-bold text-blue-900">{selectedJob.jobTitle}</h2>
    <p className="text-gray-700 text-lg font-medium mb-4">
      📍 {selectedJob.jobLocation}
    </p>

    {/* Job Details */}
    <div className="border-t border-gray-300 pt-4">
      <p className="text-gray-700 text-lg">
        🗓️ <span className="font-semibold">Posted:</span>{" "}
        {new Date(selectedJob.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>
      <p className="text-gray-700 text-lg">
        💰 <span className="font-semibold">Salary:</span>{" "}
        {selectedJob.salaryConfidential
          ? "Confidential"
          : `${selectedJob.salary} (${selectedJob.salaryCategory})`}
      </p>
      <p className="text-gray-700 text-lg">
        🎓 <span className="font-semibold">Experience Required:</span>{" "}
        {selectedJob.experience} years
      </p>
    </div>

    {/* Job Description */}
    <div className="mt-6">
      <h3 className="text-xl font-semibold text-blue-700">Job Description:</h3>
      <p className="text-gray-800 mt-2 text-lg leading-relaxed">
        {selectedJob.jobDescription}
      </p>
    </div>

    {/* Requirements */}
    <div className="mt-6">
      <h3 className="text-xl font-semibold text-blue-700">Requirements:</h3>
      <ul className="list-disc pl-6 text-gray-800 text-lg">
        {selectedJob.requirements.map((req, index) => (
          <li key={index} className="mt-2">
            ✅ {req}
          </li>
        ))}
      </ul>
    </div>

    {/* Qualifications */}
    <div className="mt-6">
      <h3 className="text-xl font-semibold text-blue-700">Qualifications:</h3>
      <ul className="list-disc pl-6 text-gray-800 text-lg">
        {selectedJob.qualifications.map((qual, index) => (
          <li key={index} className="mt-2">
            🎓 {qual}
          </li>
        ))}
      </ul>
    </div>

    {/* Screening Questions */}
    {selectedJob.screeningQuestions.length > 0 && (
      <div className="mt-6">
        <h3 className="text-xl font-semibold text-blue-700">Screening Questions:</h3>
        <ul className="list-disc pl-6 text-gray-800 text-lg">
          {selectedJob.screeningQuestions.map((question, index) => (
            <li key={index} className="mt-2">
              ❓ {question.question}{" "}
              {question.isMandatory && (
                <span className="text-red-500 font-medium">(Mandatory)</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    )}

    {/* Apply Button */}
    <div className="mt-8 flex justify-center">
      <button className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition" onClick={() => navigate(`/applicant/${selectedJob._id}`)}>
        View Applications
      </button>
    </div>
  </div>
)}

    </div>

    </Box>
  );
};

export default JobPosted;
