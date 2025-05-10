import React, { useState,useEffect } from "react";
import { useCallback } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Stack,
} from "@mui/material";
import {
  LocationOnOutlined,
  WorkOutlineOutlined,
  CurrencyRupee,
} from "@mui/icons-material";
import { apiRequest } from "../../../utils";

function JobDesc({ jobId }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [job, setJob] = useState({
    jobTitle: "",
    workType: "",
    workMode: "",
    jobLocation: "",
    salary: 0,
    experience: 0,
    jobDescription: "",
    requirements: [],
    qualifications: [],
    skills: [],
    screeningQuestions: [],
    applicationLink: "",
    _id: "",
  });
  const [jobDetails, setJobDetails] = useState({
    jobDescription: "",
    requirements: [""],
    qualifications: [""],
    skills: [""],
  });
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
            jobDescription: res.data.jobDescription || "",
            requirements: res.data.requirements || [""],
            qualifications: res.data.qualifications || [""],
            skills: res.data.skills || [""],
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



  const handleChange =
    (field, index = null) =>
    (e) => {
      if (index !== null) {
        const updatedArray = [...jobDetails[field]];
        updatedArray[index] = e.target.value;
        setJobDetails((prev) => ({ ...prev, [field]: updatedArray }));
      } else {
        const value =
          e.target.type === "checkbox" ? e.target.checked : e.target.value;
        setJobDetails((prev) => ({ ...prev, [field]: value }));
      }
    };

  const addField = (field) => {
    setJobDetails((prev) => ({ ...prev, [field]: [...prev[field], ""] }));
  };

  const removeField = (field, index) => {
    setJobDetails((prev) => {
      const updatedArray = [...prev[field]];
      updatedArray.splice(index, 1);
      return { ...prev, [field]: updatedArray };
    });
  };

  const handleSave = async () => {
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
              jobTitle: job.jobTitle,
              workType: job.workType,
              workMode: job.workMode,
              jobLocation: job.jobLocation,
              salary: job.salary,
              experience: job.experience,
              jobDescription: jobDetails.jobDescription,
              skills: job.skills,
              requirements: jobDetails.requirements,
              screeningQuestions: job.screeningQuestions,
              applicationLink: job.applicationLink,
              qualifications:jobDetails.qualifications,
              jobId: job._id,
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

  if (isFetching && !job._id) {
    return (
      <Box textAlign="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }


  return (
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
        <Box>
          <Typography
            sx={{ fontFamily: "Satoshi", fontWeight: 700, color: "#24252C" }}
          >
            Job Description:
          </Typography>
          {isEditing ? (
            <TextField
              fullWidth
              multiline
              value={jobDetails.jobDescription}
              onChange={handleChange("jobDescription")}
              sx={{ mt: 1 }}
            />
          ) : (
            <Typography sx={{ mt: 1, color: "#474E68", fontFamily: "Satoshi" }}>
              {jobDetails?.jobDescription}
            </Typography>
          )}

          {["requirements", "qualifications"].map((field) => (
            <Box key={field} sx={{ mt: 2 }}>
              <Typography
                sx={{
                  fontFamily: "Satoshi",
                  fontWeight: 700,
                  color: "#24252C",
                }}
              >
                {field.charAt(0).toUpperCase() + field.slice(1)}:
              </Typography>
              {isEditing ? (
                <>
                  {jobDetails[field]?.map((item, index) => (
                    <Box key={index} sx={{ display: "flex", gap: 1, mt: 1 }}>
                      <TextField
                        fullWidth
                        value={item}
                        onChange={handleChange(field, index)}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2, // theme spacing = 8px * 2 = 16px
                          },
                        }}
                      />

                      <Button onClick={() => removeField(field, index)} sx={{fontFamily:"Satoshi"}}>
                        Remove
                      </Button>
                    </Box>
                  ))}
                  <Button
                    onClick={() => addField(field)}
                    sx={{ mt: 1, textTransform: "none" }}
                  >
                    + Add {field.slice(0, -1)}
                  </Button>
                </>
              ) : (
                job[field]?.map((item, index) => (
                  <Typography
                    key={index}
                    sx={{
                      mt: 0.5,
                      color: "#474E68",
                      fontFamily: "Satoshi",
                    }}
                  >
                    - {item}
                  </Typography>
                ))
              )}
            </Box>
          ))}

          <Typography
            sx={{
              fontFamily: "Satoshi",
              fontWeight: 700,
              color: "#24252C",
              mt: 2,
            }}
          >
            Skills:
          </Typography>
          <Typography
            sx={{
              mt: 1,
              color: "#474E68",
              fontFamily: "Satoshi",
            }}
          >
            {Array.isArray(job.skills) && job.skills.length > 0 ? (
              <Typography
                sx={{ mt: 1, color: "#474E68", fontFamily: "Satoshi" }}
              >
                {job.skills.join(", ")}
              </Typography>
            ) : (
              <Typography
                sx={{
                  mt: 1,
                  color: "#9CA3AF",
                  fontStyle: "italic",
                  fontFamily: "Satoshi",
                }}
              >
                No skills provided.
              </Typography>
            )}
          </Typography>

          <Box sx={{ mt: 4 }}>
            {isEditing ? (
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  onClick={handleSave}
                  disabled={isFetching}
                >
                  {isFetching ? <CircularProgress size={24} /> : "Save"}
                </Button>
                <Button variant="outlined" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </Stack>
            ) : (
              <Button
                variant="contained"
                onClick={() => setIsEditing(true)}
                sx={{ textTransform: "none" }}
              >
                Edit
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default JobDesc;
