import React from "react";
import { Box, Stack, Typography, Chip, Button } from "@mui/material";
import moment from "moment";
import {
  LocationOnOutlined,
  WorkOutlineOutlined,
  CurrencyRupee,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

function JobCardRecriter({ job }) {
  const navigate = useNavigate();
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
            <Typography sx={{ color: "#474E68", fontFamily: "Poppins", mt: 2 }}>
              Total Applicants: {job.totalApplications}
            </Typography>
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
                  fontSize: { md: "16px", lg: "16px", xs: "12px", sm: "12px" },
                  textTransform: "none",
                }}
                onClick={() => navigate("/view-job-post", { state: { job } })}
              >
                Job Details
              </Button>
              <Button
                variant="contained"
                sx={{
                  bgcolor: "#3C7EFC",
                  py: 1,
                  px: 2,
                  borderRadius: 50,
                  fontFamily: "Satoshi",
                  fontWeight: 700,
                  fontSize: { md: "16px", lg: "16px", xs: "12px", sm: "12px" },
                  textTransform: "none",
                }}
                onClick={() => {
                  navigate(`/applicant/${job._id}`);
                }}
              >
                View Applications
              </Button>
            </Box>
          </Stack>
        </Box>
      </Box>
    </div>
  );
}

export default JobCardRecriter;
