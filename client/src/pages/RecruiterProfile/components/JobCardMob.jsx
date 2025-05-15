import React, { useState } from "react";
import {
  Box,
  Stack,
  Typography,
  Chip,
  Button,
  Avatar,
  CircularProgress,
} from "@mui/material";
import moment from "moment";
import {
  LocationOnOutlined,
  WorkOutlineOutlined,
  CurrencyRupee,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useMediaQuery, useTheme } from "@mui/material";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import DeleteIcon from "@mui/icons-material/Delete";

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
          justifyContent: "center",
          width: "100%",
        }}
      >
        <Box
          sx={{
            width: { md: "50%", lg: "50%", xs: "100%", sm: "100%" },
            border: "1px solid #00000040",
            p: 3,
            borderRadius: 4,
          }}
        >
          <Stack>
            {/* Avatar always top-left */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                alignItems: "flex-start",
                mb: { xs: 4 },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box>
                  <Avatar
                    sx={{
                      bgcolor: "#D9D9D9",
                      width: 40,
                      height: 40,
                      fontSize: "1.5rem",
                      mr: { xs: 2, sm: 4 },
                    }}
                  >
                    {job.jobTitle.charAt(0)}
                  </Avatar>
                </Box>
                {/* Name */}
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <Typography
                    sx={{
                      color: "#24252C",
                      fontFamily: "Poppins",
                      fontWeight: 500,
                      fontSize: "16px",
                    }}
                  >
                    {job.jobTitle}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "Poppins",
                      fontSize: "12px",
                      color: "#00A824E5",
                    }}
                  >
                    {moment(job?.createdAt).fromNow()}
                  </Typography>
                </Box>
              </Box>
            </Box>
            {/* Job Details */}
            <Box sx={{ display: "flex", flexWrap: "wrap" }} gap={1}>
              <Box sx={{ display: "flex" }} gap={0.5}>
                <Chip
                  icon={<LocationOnOutlined sx={{ color: "#474E68" }} />}
                  label={job?.jobLocation}
                  variant="contained"
                  sx={{ color: "#474E68", fontWeight: "400" }}
                />
                <Chip
                  icon={<WorkOutlineOutlined sx={{ color: "#474E68" }} />}
                  label={`${job?.experience}+ years experience`}
                  variant="contained"
                  sx={{ color: "#474E68", fontWeight: "400" }}
                />
              </Box>
              <Chip
                icon={<CurrencyRupee sx={{ color: "#474E68" }} />}
                label={
                  job.salaryConfidential
                    ? "Confidential"
                    : `${Number(job.salary).toLocaleString("en-IN")} (${
                        job.salaryCategory
                      })`
                }
                variant="contained"
                sx={{ color: "#474E68", fontWeight: "400" }}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                mt: 3,
              }}
            >
              
              {job?.status && (
                <Typography sx={{ color: "#474E68", fontFamily: "Poppins" }}>
                  Job Status:{" "}
                  <span style={{ textTransform: "uppercase" }}>
                    {job.status}
                  </span>
                </Typography>
              )}

              {(job.status === "live" || job.status === "paused") && (
                <Typography
                  sx={{
                    mt:1,
                    textAlign:"right",
                    color: "#2F6DE0",
                    fontFamily: "Poppins",
                    fontSize: "14px",
                    cursor: "pointer",
                  }}
                  onClick={() => navigate(`/applicant/${job._id}`)}
                >
                  <RemoveRedEyeIcon fontSize="25px" /> View applications
                </Typography>
              )}
            </Box>
          </Stack>
        </Box>
      </Box>
    </div>
  );
}

export default JobCardRecriter;
