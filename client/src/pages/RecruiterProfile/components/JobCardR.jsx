import React from "react";
import { Box, Stack, Typography, Chip, Button } from "@mui/material";
import moment from "moment";
import {
  LocationOnOutlined,
  WorkOutlineOutlined,
  CurrencyRupee,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

function JobCardRecriter({ job, fetchJobs }) {
  console.log(job);
  const navigate = useNavigate();
  const handleStatusUpdate = async (newStatus) => {
    try {
      const response = await fetch(
        "https://highimpacttalent.onrender.com/api-v1/jobs/update-status",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jobId: job._id,
            status: newStatus,
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        fetchJobs(); // Refresh the job list after successful update
      }
    } catch (error) {
      console.error("Error updating job status:", error);
    }
  };

  return (
    <div>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          borderBottom: "1px solid #00000040",
        }}
      >
        <Box
          sx={{
            width: "100%" ,
            p:1
          }}
        >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Typography
                sx={{
                  color: "#24252C",
                  fontFamily: "Poppins",
                  fontWeight: 600,
                  fontSize: "22px",
                }}
              >
                {job.jobTitle}
              </Typography>
              <Typography
                sx={{
                  color: "#808195",
                  fontFamily: "Poppins",
                  fontSize: "14px",
                }}
              >
                Posted on{" "}
                {new Date(job?.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Typography>
            </Box>
            {/* Job Details */}
            <Box sx={{ display: "flex", flexWrap: "wrap", mt: 2 }} gap={1}>
              <Box sx={{ display: "flex" }} gap={0.5}>
                <Chip
                  icon={<LocationOnOutlined sx={{ color: "#474E68" }} />}
                  label={job?.jobLocation}
                  variant="contained"
                  sx={{ color: "#474E68", fontWeight: "400" }}
                />
                <Chip
                  icon={<WorkOutlineOutlined sx={{ color: "#474E68" }} />}
                  label={`${job?.experience.minExperience} - ${job?.experience.maxExperience} years experience`}
                  variant="contained"
                  sx={{ color: "#474E68", fontWeight: "400" }}
                />
              </Box>
              <Chip
                icon={<CurrencyRupee sx={{ color: "#474E68" }} />}
                label={
                  job.salaryConfidential
                    ? "Confidential"
                    : job.salary?.minSalary && job.salary?.maxSalary
                    ? `₹${job.salary.minSalary}L - ₹${job.salary.maxSalary}L (${job.salaryCategory})`
                    : "Salary Not Specified"
                }
                variant="contained"
                sx={{ color: "#474E68", fontWeight: "400" }}
              />
            </Box>
        </Box>
      </Box>
    </div>
  );
}

export default JobCardRecriter;
