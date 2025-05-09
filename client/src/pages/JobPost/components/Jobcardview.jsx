import React, { useState,useEffect } from "react";
import {
  Box,
  Stack,
  Typography,
  Chip,
  Button,
  TextField,
  CircularProgress,
} from "@mui/material";
import moment from "moment";
import {
  LocationOnOutlined,
  WorkOutlineOutlined,
  CurrencyRupee,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import { Edit } from "@mui/icons-material";
import { apiRequest } from "../../../utils";
function JobCardRecriter({ jobId }) {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [job, setJob] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  console.log(job)
  const [jobDetails, setJobDetails] = useState({
    jobTitle: "",
    location: "",
    salary:  "",
    salaryCategory: "",
    experience:"",
    salaryConfidential: false,
  });

  const handleChange = (field) => (e) => {
    const value =
      field === "salaryConfidential" ? e.target.checked : e.target.value;
    setJobDetails((prev) => ({ ...prev, [field]: value }));
  };

  const fetchJobDetails = useCallback(async () => {
    setIsFetching(true);
    try {
      const res = await apiRequest({
        url: `/jobs/get-job-detail/${jobId}`,
        method: "GET",
      });
      if (res?.data) {
        setJob(res.data);
        // seed the form fields
        setJobDetails({
          jobTitle: res.data.jobTitle || "",
          location: res.data.jobLocation || "",
          salary: res.data.salary || "",
          salaryCategory: res.data.salaryCategory || "",
          experience: res.data.experience || "",
          salaryConfidential: res.data.salaryConfidential || false,
        });
      }
    } catch (error) {
      console.error("Error fetching job details:", error);
    } finally {
      setIsFetching(false);
    }
  }, [jobId]);

  useEffect(() => {
    if (jobId) fetchJobDetails();
  }, [jobId, fetchJobDetails]);


  const handleSaveClick = async () => {
    if (isEditing) {
      // Saving updated job
      setIsFetching(true);
      try {
        const response = await fetch(
          "https://highimpacttalent.onrender.com/api-v1/jobs/update-job",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              jobTitle: jobDetails.jobTitle,
              workType: job?.workType,
              workMode: job?.workMode,
              jobLocation: jobDetails.location,
              salary: jobDetails.salary,
              experience: jobDetails.experience,
              jobDescription: job?.jobDescription,
              skills: job?.skills,
              requirements: job?.requirements,
              maxApplicants: job?.maxApplicants,
              screeningQuestions: job?.screeningQuestions,
              applicationLink: job?.applicationLink,
              jobId: jobId,
            }),
          }
        );

        const result = await response.json();
        console.log("Updated successfully:", result);
        await fetchJobDetails();
      } catch (err) {
        console.error("Error updating job:", err);
      } finally {
        setIsFetching(false);
      }
    }

    setIsEditing(!isEditing);
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
            width: { md: "70%", lg: "70%", xs: "100%", sm: "100%" },
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
              {isEditing ? (
                <TextField
                  value={jobDetails.jobTitle}
                  onChange={handleChange("jobTitle")}
                  variant="outlined"
                  size="small"
                  sx={{
                    width: { xs: "100%", sm: "100%", md: "40%", lg: "40%" },
                    fontFamily: "Poppins",
                    fontWeight: 600,
                    fontSize: "22px",
                  }}
                />
              ) : (
                <Typography
                  sx={{
                    color: "#24252C",
                    fontFamily: "Poppins",
                    fontWeight: 600,
                    fontSize: "22px",
                  }}
                >
                  {jobDetails.jobTitle}
                </Typography>
              )}

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
                {isEditing ? (
                  <TextField
                    value={jobDetails.location}
                    onChange={handleChange("location")}
                    variant="outlined"
                    size="small"
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <LocationOnOutlined sx={{ color: "#474E68", mr: 1 }} />
                      ),
                    }}
                    sx={{
                      maxWidth: {
                        xs: "100%",
                        sm: "100%",
                        md: "40%",
                        lg: "30%",
                      },
                    }}
                  />
                ) : (
                  <Chip
                    icon={<LocationOnOutlined sx={{ color: "#474E68" }} />}
                    label={jobDetails.location}
                    variant="contained"
                    sx={{ color: "#474E68", fontWeight: "400" }}
                  />
                )}

                {isEditing ? (
                  <TextField
                    value={jobDetails.experience}
                    onChange={handleChange("experience")}
                    variant="outlined"
                    placeholder="experience"
                    size="small"
                    type="number"
                    sx={{
                      maxWidth: {
                        xs: "100%",
                        sm: "100%",
                        md: "40%",
                        lg: "30%",
                      },
                    }}
                  />
                ) : (
                  <Chip
                    icon={<WorkOutlineOutlined sx={{ color: "#474E68" }} />}
                    label={`${jobDetails.experience}+ years experience`}
                    variant="contained"
                    sx={{ color: "#474E68", fontWeight: "400" }}
                  />
                )}
              </Box>
              {isEditing ? (
                <Stack direction="row" spacing={0} alignItems="center" sx={{display:"flex",flexWrap:"wrap",gap:1}}>
                  <TextField
                    value={jobDetails.salary}
                    onChange={handleChange("salary")}
                    variant="outlined"
                    size="small"
                    type="number"
                    placeholder="Enter salary"
                    sx={{ width: 150 }}
                  />
                  <TextField
                    value={jobDetails.salaryCategory}
                    onChange={handleChange("salaryCategory")}
                    variant="outlined"
                    size="small"
                    placeholder="Category"
                    sx={{ width: 130 }}
                  />
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={jobDetails.salaryConfidential}
                      onChange={handleChange("salaryConfidential")}
                    />
                    Confidential
                  </label>
                </Stack>
              ) : (
                <Chip
                  icon={<CurrencyRupee sx={{ color: "#474E68" }} />}
                  label={
                    jobDetails.salaryConfidential
                      ? "Confidential"
                      : `${Number(jobDetails.salary).toLocaleString(
                          "en-IN"
                        )} (${jobDetails.salaryCategory || ""})`
                  }
                  variant="contained"
                  sx={{ color: "#474E68", fontWeight: "400" }}
                />
              )}
            </Box>
            <Box sx={{ display: "flex", flexWrap: "wrap", mt: 2 }} gap={1}>
              {job?.skills && job.skills.length > 0 ? (
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
                  No skills provided *
                </Typography>
              )}
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                sx={{ color: "#474E68", fontFamily: "Poppins", mt: 2 }}
              >
                Total Applicants: {job?.totalApplications}
              </Typography>
              <Typography
                onClick={isEditing ? handleSaveClick : () => setIsEditing(true)}
                sx={{
                  color: "#474E68",
                  fontFamily: "Poppins",
                  mt: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 0.5,
                  cursor: "pointer",
                  fontWeight: 600,
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                {!isFetching ? (
                  isEditing ? (
                    "Save Changes"
                  ) : (
                    "Edit Profile"
                  )
                ) : (
                  <CircularProgress size={24} />
                )}
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Box>
    </div>
  );
}

export default JobCardRecriter;
