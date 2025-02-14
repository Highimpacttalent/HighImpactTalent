import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { apiRequest } from "../utils";
import moment from "moment";
import JobCard from "../components/JobCard";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Stack,
  CircularProgress,
} from "@mui/material";
import { AiOutlineSafetyCertificate } from "react-icons/ai";

const JobDetail = () => {
  const { id } = useParams();
  const { user } = useSelector((state) => state.user);
  const [job, setJob] = useState(null);
  const [similarJobs, setSimilarJobs] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getJobDetails = async () => {
      setIsFetching(true);
      try {
        const res = await apiRequest({
          url: `/jobs/get-job-detail/${id}`,
          method: "GET",
        });
        if (res?.data) {
          setJob(res.data);
          setSimilarJobs(res.similarJobs);
        }
      } catch (error) {
        console.error("Error fetching job details:", error);
      } finally {
        setIsFetching(false);
      }
    };

    if (id) getJobDetails();
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      setIsFetching(true);
      try {
        await apiRequest({
          url: `/jobs/delete-job/${job?.id}`,
          token: user?.token,
          method: "DELETE",
        });
        navigate("/");
      } catch (error) {
        console.error("Error deleting job:", error);
      } finally {
        setIsFetching(false);
      }
    }
  };

  if (isFetching || !job) {
    return (
      <CircularProgress sx={{ display: "block", mx: "auto", mt: 5, mb: 5 }} />
    );
  }

  return (
    <Box sx={{ maxWidth: "1200px", mx: "auto", p: 3, bgcolor: "#f3f4f6" }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3, boxShadow: 2 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Stack>
                <Typography variant="h5" fontWeight={600}>
                  {job?.jobTitle}
                </Typography>
                <Typography color="primary" fontWeight={500}>
                  {job?.company?.name}
                </Typography>
                <Typography color="textSecondary" fontWeight={500}>
                  {job?.jobLocation}
                </Typography>
                <Typography color="textSecondary">
                  Posted {moment(job?.createdAt).fromNow()}...
                </Typography>
              </Stack>

              <Box sx={{ display: "flex", alignItems: "flex-start", mt: 1 }}>
                <AiOutlineSafetyCertificate size={28} color="blue" />
              </Box>
            </Box>

            <Typography variant="h6" mt={2} sx={{ fontWeight: "bold" }}>
              Job Description
            </Typography>
            <Typography>{job?.jobDescription}</Typography>

            <Typography fontWeight="bold" mt={2}>
              Experience: {job?.experience} Year+
            </Typography>
            <Typography fontWeight="bold" mt={2}>
              Salary:{" "}
              {job?.salaryConfidential
                ? "Confidential"
                : `₹${job?.salary?.toLocaleString()}`}{" "}
              per year
            </Typography>

            {job?.requirements?.length > 0 && (
              <Box mt={2}>
                <Typography fontWeight={600}>Requirements</Typography>
                <ul>
                  {job.requirements.length > 0 &&
                  job.requirements.some((req) => req.trim() !== "") ? (
                    job.requirements
                      .filter((req) => req.trim() !== "")
                      .map((req, index) => <li key={index}>{req}</li>)
                  ) : (
                    <li style={{ color: 'rgba(0, 0, 0, 0.60)' }}>No requirement mentioned by the company.</li>
                  )}
                </ul>
              </Box>
            )}

            {job?.qualifications?.some((qual) => qual.trim() !== "") ? (
              <Box mt={2}>
                <Typography fontWeight={600}>Qualifications</Typography>
                <ol>
                  {job.qualifications.map(
                    (qual, index) =>
                      qual.trim() && (
                        <li key={index}>
                          {index + 1}. {qual}
                        </li>
                      )
                  )}
                </ol>
              </Box>
            ) : (
              <>
                <Typography mt={2} fontWeight={600}>
                  Qualifications:
                </Typography>
                <Typography mt={1} color="textSecondary">
                  No qualification mentioned by company.
                </Typography>
              </>
            )}

            {user?.token == null ? (
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                onClick={() => navigate("/user-auth")}
              >
                Login/Register To Apply
              </Button>
            ) : user?.accountType === "seeker" ? (
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                onClick={() => {
                  if (!job || !user || !job?.company) {
                    console.error("Missing required data for navigation.");
                    return;
                  }

                  navigate("screening-questions", {
                    state: {
                      questions: job?.screeningQuestions ?? [],
                      jobid: job?._id,
                      companyid: job?.company?._id,
                      userid: user?._id,
                    },
                  });
                }}
              >
                Apply Now
              </Button>
            ) : null}

            {user?.id === job?.company?._id && (
              <Button
                variant="contained"
                color="error"
                fullWidth
                sx={{ mt: 2 }}
                onClick={handleDelete}
              >
                Delete Job
              </Button>
            )}
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Typography
            variant="h6"
            color="textSecondary"
            mb={2}
            sx={{ fontWeight: "bold" }}
          >
            Similar Job Posts
          </Typography>
          <Grid container spacing={2}>
            {similarJobs.slice(0, 6).map((job, index) => (
              <Grid item xs={12} key={index}>
                <JobCard job={job} />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default JobDetail;
