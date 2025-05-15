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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [progress, setProgress] = useState(false);
  console.log(job);
  const navigate = useNavigate();
  const handleStatusUpdate = async (newStatus) => {
    try {
      setProgress(true);
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
    } finally {
      setProgress(false);
    }
  };

  const desktopView = (
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
            p: 4,
            borderRadius: 4,
          }}
        >
          <Stack>
            <Box
              sx={{
                display: "flex",
                alignItems: {
                  lg: "center",
                  sm: "flex-start",
                  md: "center",
                  xs: "flex-start",
                },
                justifyContent: "space-between",
                flexDirection: {
                  xs: "column",
                  sm: "column",
                  md: "row",
                  lg: "row",
                },
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
                Posted {moment(job?.createdAt).fromNow()}
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
            <Box sx={{ display: "flex", flexWrap: "wrap", mt: 2 }} gap={1}>
              {job.skills && job.skills.length > 0 ? (
                job.skills.map((skill, index) => (
                  <Box key={index} sx={{ display: "flex" }} gap={0.5}>
                    <Chip
                      label={skill}
                      variant="contained"
                      sx={{
                        bgcolor: "#E3EDFF",
                        color: "#474E68",
                        fontWeight: "400",
                      }}
                    />
                  </Box>
                ))
              ) : (
                <Typography
                  sx={{
                    mt: 1,
                    color: "#9CA3AF",
                    fontStyle: "italic",
                    fontFamily: "Satoshi",
                  }}
                >
                  No skills provided*
                </Typography>
              )}
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography
                sx={{ color: "#474E68", fontFamily: "Poppins", mt: 2 }}
              >
                Total Applicants: {job.totalApplications}
              </Typography>
              {job?.status && (
                <Typography
                  sx={{ color: "#474E68", fontFamily: "Poppins", mt: 2 }}
                >
                  Job Status:{" "}
                  <span style={{ textTransform: "uppercase" }}>
                    {job.status}
                  </span>
                </Typography>
              )}
            </Box>
            {job.status !== "deleted" && (
              <Box sx={{ display: "flex", mt: 2, gap: 2 }}>
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: "#3C7EFC",
                    py: 1,
                    px: 2,
                    borderRadius: 50,
                    fontFamily: "Satoshi",
                    fontWeight: 700,
                    fontSize: {
                      md: "16px",
                      lg: "16px",
                      xs: "12px",
                      sm: "12px",
                    },
                    textTransform: "none",
                  }}
                  onClick={() => navigate("/view-job-post", { state: { job } })}
                >
                  Edit Job
                </Button>

                {(job.status === "live" || job.status === "paused") && (
                  <Button
                    variant="contained"
                    sx={{
                      bgcolor: "#3C7EFC",
                      py: 1,
                      px: 2,
                      borderRadius: 50,
                      fontFamily: "Satoshi",
                      fontWeight: 700,
                      fontSize: {
                        md: "16px",
                        lg: "16px",
                        xs: "12px",
                        sm: "12px",
                      },
                      textTransform: "none",
                    }}
                    onClick={() => navigate(`/applicant/${job._id}`)}
                  >
                    View Applications
                  </Button>
                )}

                {(job.status === "draft" || job.status === "paused") && (
                  <Button
                    variant="contained"
                    sx={{
                      bgcolor: "#4CAF50", // Green color for Live action
                      py: 1,
                      px: 2,
                      borderRadius: 50,
                      fontFamily: "Satoshi",
                      fontWeight: 700,
                      fontSize: {
                        md: "16px",
                        lg: "16px",
                        xs: "12px",
                        sm: "12px",
                      },
                      textTransform: "none",
                    }}
                    onClick={() => handleStatusUpdate("live")}
                  >
                    Make it Live
                  </Button>
                )}
                {job.status === "live" && (
                  <Button
                    variant="contained"
                    sx={{
                      bgcolor: "#FF9800",
                      py: 1,
                      px: 2,
                      borderRadius: 50,
                      fontFamily: "Satoshi",
                      fontWeight: 700,
                      fontSize: {
                        md: "16px",
                        lg: "16px",
                        xs: "12px",
                        sm: "12px",
                      },
                      textTransform: "none",
                    }}
                    onClick={() => handleStatusUpdate("paused")}
                  >
                    Pause Job
                  </Button>
                )}

                {job.status !== "deleted" && (
                  <Button
                    variant="contained"
                    sx={{
                      bgcolor: "#F44336",
                      py: 1,
                      px: 2,
                      borderRadius: 50,
                      fontFamily: "Satoshi",
                      fontWeight: 700,
                      fontSize: {
                        md: "16px",
                        lg: "16px",
                        xs: "12px",
                        sm: "12px",
                      },
                      textTransform: "none",
                    }}
                    onClick={() => handleStatusUpdate("deleted")}
                  >
                    Delete Job
                  </Button>
                )}
              </Box>
            )}
          </Stack>
        </Box>
      </Box>
    </div>
  );

  const mobileView = (
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
              <Box>
                {job.status !== "deleted" && (
                  <Typography
                    sx={{
                      py: 0.25,
                      color: "#558CB9",
                      fontFamily: "Poppins",
                      fontWeight: 500,
                      fontSize: "14px",
                      borderRadius: 2,
                    }}
                    onClick={() => navigate("/view-job-post", { state: { job } })}
                  >
                    Edit Details
                  </Typography>
                )}
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
                alignItems: "flex-start",
                gap: 1,
                mt: 3,
              }}
            >
              {(job.status === "live" || job.status === "paused") && (
                <Typography
                  sx={{
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
              {job?.status && (
                <Typography sx={{ color: "#474E68", fontFamily: "Poppins" }}>
                  Job Status:{" "}
                  <span style={{ textTransform: "uppercase" }}>
                    {job.status}
                  </span>
                </Typography>
              )}
            </Box>
            {job.status !== "deleted" && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  mt: 2,
                  gap: 2,
                }}
              >
                {job.status !== "deleted" && progress ? (
                  <CircularProgress size={24} sx={{ color: "#9E0000" }} />
                ) : (
                  job.status !== "deleted" && (
                    <DeleteIcon
                      onClick={() => handleStatusUpdate("deleted")}
                      sx={{ color: "#9E0000" }}
                    />
                  )
                )}

                {(job.status === "draft" || job.status === "paused") && (
                  <Button
                    variant="contained"
                    sx={{
                      py: 1,
                      px: 2,
                      borderRadius: 50,
                      fontFamily: "Satoshi",
                      fontWeight: 700,
                      fontSize: {
                        md: "16px",
                        lg: "16px",
                        xs: "12px",
                        sm: "12px",
                      },
                      textTransform: "none",
                    }}
                    disabled={progress}
                    onClick={() => handleStatusUpdate("live")}
                  >
                    Make it Live
                  </Button>
                )}
                {job.status === "live" && (
                  <Button
                    variant="contained"
                    sx={{
                      py: 1,
                      px: 2,
                      borderRadius: 50,
                      fontFamily: "Satoshi",
                      fontWeight: 700,
                      fontSize: {
                        md: "16px",
                        lg: "16px",
                        xs: "12px",
                        sm: "12px",
                      },
                      textTransform: "none",
                    }}
                    disabled={progress}
                    onClick={() => handleStatusUpdate("paused")}
                  >
                    Pause Job
                  </Button>
                )}
              </Box>
            )}
          </Stack>
        </Box>
      </Box>
    </div>
  );

  return <Box>{isMobile ? mobileView : desktopView}</Box>;
}

export default JobCardRecriter;
