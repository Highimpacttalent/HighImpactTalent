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
  useEffect(() => {
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
                <JobCardRecriter job={job} setSelectedJob={setSelectedJob} selectedJob={selectedJob} fetchJobs={fetchJobs}></JobCardRecriter>
            </Box>
          ))
        )}
      </div>
    </div>

    </Box>
  );
};

export default JobPosted;
