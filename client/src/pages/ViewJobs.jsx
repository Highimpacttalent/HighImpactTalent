import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ViewJobs = () => {
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
    <div className="flex flex-col md:flex-row h-screen p-6 bg-blue-50 text-gray-900">
      {/* Job List */}
      <div
        className={`md:w-1/2 transition-all ${
          selectedJob ? "md:w-1/2" : "md:w-full"
        } overflow-y-auto p-4 bg-white rounded-lg shadow-lg`}
      >
        <h2 className="text-3xl font-bold mb-6 text-blue-700">Job Listings</h2>
        {loading ? (
          <p className="text-center text-blue-600">Loading jobs...</p>
        ) : (
          jobs.map((job) => (
            <div
              key={job._id}
              className="bg-blue-100 p-5 rounded-lg shadow-md mb-4 cursor-pointer hover:bg-blue-200 transition duration-300"
              onClick={() => selectedJob == null ? setSelectedJob(job):setSelectedJob(null)}
            >
              <h3 className="text-2xl font-semibold text-blue-900">
                {job.jobTitle}
              </h3>
              <p className="text-gray-700 font-medium">{job.jobLocation}</p>
              <p className="text-gray-700 font-medium mt-1">
                Posted:{" "}
                {new Date(job.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>

              <p className="text-gray-800 truncate mt-1">
                {job.jobDescription}
              </p>
            </div>
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
  );
};

export default ViewJobs;
