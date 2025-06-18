import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { apiRequest } from "../../utils";
import moment from "moment";
import JobCard from "./components/MobileView";
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Typography,
  Grid,
  Stack,
  CircularProgress,
  Chip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { AiOutlineSafetyCertificate } from "react-icons/ai";
import ReactMarkdown from "react-markdown";

const JobDetail = () => {
  const { id } = useParams();
  const { user } = useSelector((state) => state.user);
  const [job, setJob] = useState(null);
  const [similarJobs, setSimilarJobs] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

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
          const filteredJobs = res.similarJobs
            .filter((job) => job._id !== id) // Remove current job
            .slice(0, 2); // Limit to 2 jobs

          setSimilarJobs(filteredJobs);
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

  if (isFetching || !job) {
    return (
      <CircularProgress sx={{ display: "block", mx: "auto", mt: 5, mb: 5 }} />
    );
  }

  return (
    <Box sx={{ mx: "auto", p: isMobile ? 2 : 3, bgcolor: "#fff" }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Box sx={{ mt: 2, mb: 2 }}>
            <JobCard job={job} enable={true} />
          </Box>

          {/* About the Job Section */}
          <Box sx={{ p: isMobile ? 1 : 1.5 }}>
            <Typography
              variant={isMobile ? "h6" : "h6"}
              sx={{
                fontWeight: "bold",
                fontFamily: "Poppins",
                color: "#404258",
                ml: isMobile ? 0.5 : 1.5,
                fontSize: isMobile ? "1.1rem" : "1.25rem",
              }}
            >
              About the Job
            </Typography>

            {/* Main Job Details Container */}
            <Box
              sx={{
                borderRadius: 2.5,
                p: isMobile ? 2 : 2.5,
                mt: 2,
                boxShadow: "0px 0px 4px 0px #00000040",
              }}
            >
              {/* Job Description */}
              <Typography
                sx={{
                  fontWeight: "700",
                  color: "#404258",
                  mb: 2,
                  fontFamily: "Poppins",
                  fontSize: isMobile ? "0.95rem" : "1rem",
                }}
              >
                Job Description:
              </Typography>
              <Typography
                sx={{ color: "#474E68", fontFamily: "sans-serif", mb: 3 }}
              >
                <ReactMarkdown
                  components={{
                    p: ({ node, ...props }) => (
                      <Typography
                        sx={{
                          color: "#474E68",
                          fontFamily: "sans-serif",
                          fontSize: isMobile ? "0.9rem" : "1rem",
                          mb: 1,
                        }}
                        {...props}
                      />
                    ),
                    li: ({ node, ...props }) => (
                      <li
                        style={{
                          fontFamily: "sans-serif",
                          color: "#474E68",
                          fontSize: isMobile ? "0.9rem" : "1rem",
                          marginBottom: "4px",
                        }}
                        {...props}
                      />
                    ),
                  }}
                >
                  {(job?.jobDescription || "")
                    .replace(/\\n/g, "\n")
                    .split("\n")
                    .map((line) => `- ${line}`)
                    .join("\n")}
                </ReactMarkdown>
              </Typography>

              {/* Skills Section */}
              {job?.skills?.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography
                    sx={{
                      fontWeight: "700",
                      color: "#404258",
                      mb: 2,
                      fontFamily: "Poppins",
                      fontSize: isMobile ? "0.95rem" : "1rem",
                    }}
                  >
                    Required Skills:
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: isMobile ? 0.5 : 1,
                    }}
                  >
                    {job.skills.map((skill, index) => (
                      <Chip
                        key={index}
                        label={skill}
                        sx={{
                          bgcolor: "#f5f5f5",
                          color: "#404258",
                          fontFamily: "sans-serif",
                          fontSize: isMobile ? "0.75rem" : "0.85rem",
                          height: isMobile ? "28px" : "32px",
                          "&:hover": {
                            bgcolor: "#e0e0e0",
                          },
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}

              {/* Work Details Grid */}
              <Grid container spacing={isMobile ? 1 : 2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Box
                    sx={{
                      p: isMobile ? 1.5 : 2,
                      borderRadius: 2,
                      bgcolor: "#f8f9fa",
                      border: "1px solid #e9ecef",
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: "700",
                        color: "#404258",
                        mb: 1,
                        fontFamily: "Poppins",
                        fontSize: isMobile ? "0.85rem" : "0.9rem",
                      }}
                    >
                      Work Type:
                    </Typography>
                    <Typography
                      sx={{
                        color: "#474E68",
                        fontFamily: "sans-serif",
                        fontSize: isMobile ? "0.85rem" : "1rem",
                      }}
                    >
                      {job?.workType || "Not specified"}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box
                    sx={{
                      p: isMobile ? 1.5 : 2,
                      borderRadius: 2,
                      bgcolor: "#f8f9fa",
                      border: "1px solid #e9ecef",
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: "700",
                        color: "#404258",
                        mb: 1,
                        fontFamily: "Poppins",
                        fontSize: isMobile ? "0.85rem" : "0.9rem",
                      }}
                    >
                      Work Mode:
                    </Typography>
                    <Typography
                      sx={{
                        color: "#474E68",
                        fontFamily: "sans-serif",
                        fontSize: isMobile ? "0.85rem" : "1rem",
                      }}
                    >
                      {job?.workMode || "Not specified"}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              {/* Qualifications */}
              {job?.qualifications?.some((qual) => qual.trim() !== "") ? (
                <Box sx={{ mb: 3 }}>
                  <Typography
                    sx={{
                      fontWeight: "700",
                      color: "#404258",
                      mb: 2,
                      fontFamily: "Poppins",
                      fontSize: isMobile ? "0.95rem" : "1rem",
                    }}
                  >
                    Qualifications:
                  </Typography>
                  <Box sx={{ pl: isMobile ? 0.5 : 1 }}>
                    {job.qualifications.map(
                      (qual, index) =>
                        qual.trim() && (
                          <Typography
                            key={index}
                            sx={{
                              color: "#474E68",
                              fontFamily: "sans-serif",
                              mb: 1,
                              display: "flex",
                              alignItems: "flex-start",
                              fontSize: isMobile ? "0.9rem" : "1rem",
                            }}
                          >
                            <span
                              style={{ marginRight: "8px", color: "#404258" }}
                            >
                              &#8226;
                            </span>
                            {qual}
                          </Typography>
                        )
                    )}
                  </Box>
                </Box>
              ) : (
                <Box sx={{ mb: 3 }}>
                  <Typography
                    sx={{
                      fontWeight: "700",
                      color: "#404258",
                      mb: 2,
                      fontFamily: "Poppins",
                      fontSize: isMobile ? "0.95rem" : "1rem",
                    }}
                  >
                    Qualifications:
                  </Typography>
                  <Typography
                    sx={{
                      color: "#474E68",
                      fontFamily: "sans-serif",
                      fontSize: isMobile ? "0.9rem" : "1rem",
                    }}
                  >
                    No qualification mentioned by company.
                  </Typography>
                </Box>
              )}

              {/* Additional Job Information */}
              {(job?.duration || job?.companyType ) && (
                <Box sx={{ mb: 3 }}>
                  <Typography
                    sx={{
                      fontWeight: "700",
                      color: "#404258",
                      mb: 2,
                      fontFamily: "Poppins",
                      fontSize: isMobile ? "0.95rem" : "1rem",
                    }}
                  >
                    Additional Information:
                  </Typography>
                  <Grid container spacing={isMobile ? 1 : 2}>
                    {job?.duration && (
                      <Grid item xs={12} sm={4}>
                        <Box
                          sx={{
                            p: isMobile ? 1 : 1.5,
                            borderRadius: 1.5,
                            bgcolor: "#f8f9fa",
                            border: "1px solid #e9ecef",
                            textAlign: "center",
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: isMobile ? "0.7rem" : "0.8rem",
                              color: "#6c757d",
                              fontFamily: "Poppins",
                              mb: 0.5,
                            }}
                          >
                            Duration
                          </Typography>
                          <Typography
                            sx={{
                              fontWeight: "600",
                              color: "#404258",
                              fontFamily: "sans-serif",
                              textTransform: "capitalize",
                              fontSize: isMobile ? "0.85rem" : "1rem",
                            }}
                          >
                            {job.duration}
                          </Typography>
                        </Box>
                      </Grid>
                    )}
                    {job?.companyType && (
                      <Grid item xs={12} sm={4}>
                        <Box
                          sx={{
                            p: isMobile ? 1 : 1.5,
                            borderRadius: 1.5,
                            bgcolor: "#f8f9fa",
                            border: "1px solid #e9ecef",
                            textAlign: "center",
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: isMobile ? "0.7rem" : "0.8rem",
                              color: "#6c757d",
                              fontFamily: "Poppins",
                              mb: 0.5,
                            }}
                          >
                            Company Type
                          </Typography>
                          <Typography
                            sx={{
                              fontWeight: "600",
                              color: "#404258",
                              fontFamily: "sans-serif",
                              fontSize: isMobile ? "0.85rem" : "1rem",
                            }}
                          >
                            {job.companyType}
                          </Typography>
                        </Box>
                      </Grid>
                    )}
                  </Grid>
                </Box>
              )}

              {/* Graduation Batch Preference */}
              {(job?.graduationYear?.minBatch ||
                job?.graduationYear?.maxBatch) && (
                <Box sx={{ mb: 3 }}>
                  <Typography
                    sx={{
                      fontWeight: "700",
                      color: "#404258",
                      mb: 2,
                      fontFamily: "Poppins",
                      fontSize: isMobile ? "0.95rem" : "1rem",
                    }}
                  >
                    Preferred Graduation Batch:
                  </Typography>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: "#f8f9fa",
                      display: "inline-block",
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: "600",
                        color: "#404258",
                        fontFamily: "sans-serif",
                      }}
                    >
                      {job.graduationYear.minBatch &&
                      job.graduationYear.maxBatch
                        ? `${job.graduationYear.minBatch} - ${job.graduationYear.maxBatch}`
                        : job.graduationYear.minBatch
                        ? `From ${job.graduationYear.minBatch} onwards`
                        : `Up to ${job.graduationYear.maxBatch}`}
                    </Typography>
                  </Box>
                </Box>
              )}

              {/* Tags */}
              {job?.tags?.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography
                    sx={{
                      fontWeight: "700",
                      color: "#404258",
                      mb: 2,
                      fontFamily: "Poppins",
                      fontSize: isMobile ? "0.95rem" : "1rem",
                    }}
                  >
                    Job Tags:
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: isMobile ? 0.5 : 1,
                    }}
                  >
                    {job.tags.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        variant="outlined"
                        sx={{
                          color: "#404258",
                          borderColor: "#404258",
                          fontFamily: "sans-serif",
                          fontSize: isMobile ? "0.7rem" : "0.8rem",
                          height: isMobile ? "26px" : "30px",
                          "&:hover": {
                            bgcolor: "#404258",
                            color: "#fff",
                          },
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}

              {/* Diversity & Inclusion */}
              {Object.values(job?.diversityPreferences || {}).some(Boolean) && (
                <Box sx={{ mb: 3 }}>
                  <Typography
                    sx={{
                      fontWeight: "700",
                      color: "#404258",
                      mb: 1,
                      fontFamily: "Poppins",
                    }}
                  >
                    Diversity & Inclusion:
                  </Typography>
                  <Box>
                    <Typography
                      sx={{
                        color: "#474E68",
                        fontFamily: "sans-serif",
                        mb: 1,
                        display: "flex",
                        alignItems: "flex-start",
                      }}
                    >
                      This company is committed to workplace diversity and
                      encourages applications from:
                    </Typography>
                    <Box sx={{ pl: 1 }}>
                      {job.diversityPreferences.femaleCandidates && (
                        <Typography
                          sx={{
                            color: "#474E68",
                            fontFamily: "sans-serif",
                            mb: 1,
                            display: "flex",
                            alignItems: "flex-start",
                          }}
                        >
                          &#8226; Female candidates
                        </Typography>
                      )}
                      {job.diversityPreferences.womenJoiningBackWorkforce && (
                        <Typography
                          sx={{
                            color: "#474E68",
                            fontFamily: "sans-serif",
                            mb: 1,
                            display: "flex",
                            alignItems: "flex-start",
                          }}
                        >
                          &#8226; Women joining back the workforce
                        </Typography>
                      )}
                      {job.diversityPreferences.exDefencePersonnel && (
                        <Typography
                          sx={{
                            color: "#474E68",
                            fontFamily: "sans-serif",
                            mb: 1,
                            display: "flex",
                            alignItems: "flex-start",
                          }}
                        >
                          &#8226; Ex-defence personnel
                        </Typography>
                      )}
                      {job.diversityPreferences.differentlyAbledCandidates && (
                        <Typography
                          sx={{
                            color: "#474E68",
                            fontFamily: "sans-serif",
                            mb: 1,
                            display: "flex",
                            alignItems: "flex-start",
                          }}
                        >
                          &#8226; Differently-abled candidates
                        </Typography>
                      )}
                      {job.diversityPreferences.workFromHome && (
                        <Typography
                          sx={{
                            color: "#474E68",
                            fontFamily: "sans-serif",
                            mb: 0.5,
                            display: "flex",
                            alignItems: "flex-start",
                          }}
                        >
                          &#8226; Candidates seeking work from home
                          opportunities
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Box>
              )}

              {(job?.category || job?.functionalArea) && (
                <Box sx={{ mb: 3 }}>
                  <Typography
                    sx={{
                      fontWeight: "700",
                      color: "#404258",
                      mb: 2,
                      fontFamily: "Poppins",
                      fontSize: isMobile ? "0.95rem" : "1rem",
                    }}
                  >
                    Job Category:
                  </Typography>
                  <Grid container spacing={isMobile ? 1 : 2}>
                    {job?.category && (
                      <Grid item xs={12} sm={6}>
                        <Box
                          sx={{
                            p: isMobile ? 1.5 : 2,
                            borderRadius: 2,
                            bgcolor: "#f8f9fa",
                            border: "1px solid #e9ecef",
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: isMobile ? "0.7rem" : "0.8rem",
                              color: "#6c757d",
                              fontFamily: "Poppins",
                              mb: 0.5,
                            }}
                          >
                            Category
                          </Typography>
                          <Typography
                            sx={{
                              fontWeight: "600",
                              color: "#404258",
                              fontFamily: "sans-serif",
                              fontSize: isMobile ? "0.85rem" : "1rem",
                            }}
                          >
                            {job.category}
                          </Typography>
                        </Box>
                      </Grid>
                    )}
                    {job?.functionalArea && (
                      <Grid item xs={12} sm={6}>
                        <Box
                          sx={{
                            p: isMobile ? 1.5 : 2,
                            borderRadius: 2,
                            bgcolor: "#f8f9fa",
                            border: "1px solid #e9ecef",
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: isMobile ? "0.7rem" : "0.8rem",
                              color: "#6c757d",
                              fontFamily: "Poppins",
                              mb: 0.5,
                            }}
                          >
                            Functional Area
                          </Typography>
                          <Typography
                            sx={{
                              fontWeight: "600",
                              color: "#404258",
                              fontFamily: "sans-serif",
                              fontSize: isMobile ? "0.85rem" : "1rem",
                            }}
                          >
                            {job.functionalArea}
                          </Typography>
                        </Box>
                      </Grid>
                    )}
                  </Grid>
                </Box>
              )}
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} md={4} sx={{ mt: 2.5 }}>
          <Typography
            variant="h6"
            color="textSecondary"
            mb={2}
            sx={{
              fontWeight: "bold",
              fontSize: isMobile ? "1.1rem" : "1.25rem",
              px: isMobile ? 1 : 0,
            }}
          >
            Similar Job Posts
          </Typography>
          <Grid container spacing={2}>
            {similarJobs.slice(0, isMobile ? 4 : 6).map((job, index) => (
              <Grid item xs={12} key={index}>
                <JobCard job={job} flag={true} />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default JobDetail;
