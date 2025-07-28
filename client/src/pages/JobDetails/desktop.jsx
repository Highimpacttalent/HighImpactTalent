import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { apiRequest } from "../../utils";
import moment from "moment";
import JobCard from "../../components/JobCard";
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Chip,
  Typography,
  Grid,
  Stack,
  CircularProgress,
} from "@mui/material";
import { AiOutlineSafetyCertificate } from "react-icons/ai";
import ReactMarkdown from "react-markdown";

const JobDetail = () => {
  const { id } = useParams();
  const { user } = useSelector((state) => state.user);
  let AlreadyApplied = false; 
  const [job, setJob] = useState(null);
  const [similarJobs, setSimilarJobs] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const navigate = useNavigate();

  const token = user?.token || localStorage.getItem("authToken");
  useEffect(() => {
    const getJobDetails = async () => {
      setIsFetching(true);
      try {
        const res = await apiRequest({
          url: `/jobs/get-job-detail/${id}`,
          method: "GET",
          token: token
        });
        if (res?.data) {
          setJob(res.data);
          setSimilarJobs(res.similarJobs);
          console.log(job._id)
          console.log(user?.appliedJobs)
          if(user?.appliedJobs?.includes(job._id)){ 
            AlreadyApplied = true;
            console.log(AlreadyApplied)
          }
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
    <Box sx={{ mx: "auto", p: 3, bgcolor: "#fff" }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Box sx={{ mt: 2, mb: 2 }}>
            <JobCard job={job} enable={true} />
          </Box>

          {/* About the Job Section */}
          <Box sx={{ p: 1.5 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                fontFamily: "Poppins",
                color: "#404258",
                ml: 1.5,
              }}
            >
              About the Job
            </Typography>

            {/* Main Job Details Container */}
            <Box
              sx={{
                borderRadius: 2.5,
                p: 2.5,
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
                }}
              >
                Job Description:
              </Typography>
              <Typography
                sx={{ color: "#474E68", fontFamily: "sans-serif", mb: 3 }}
              >
                <ReactMarkdown>
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
                    }}
                  >
                    Required Skills:
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {job.skills.map((skill, index) => (
                      <Chip
                        key={index}
                        label={skill}
                        sx={{
                          bgcolor: "#f5f5f5",
                          color: "#404258",
                          fontFamily: "sans-serif",
                          fontSize: "0.85rem",
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
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Box
                    sx={{
                      p: 2,
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
                        fontSize: "0.9rem",
                      }}
                    >
                      Work Type:
                    </Typography>
                    <Typography
                      sx={{
                        color: "#474E68",
                        fontFamily: "sans-serif",
                      }}
                    >
                      {job?.workType || "Not specified"}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box
                    sx={{
                      p: 2,
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
                        fontSize: "0.9rem",
                      }}
                    >
                      Work Mode:
                    </Typography>
                    <Typography
                      sx={{
                        color: "#474E68",
                        fontFamily: "sans-serif",
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
                    }}
                  >
                    Qualifications:
                  </Typography>
                  <Box sx={{ pl: 1 }}>
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
                    }}
                  >
                    Qualifications:
                  </Typography>
                  <Typography
                    sx={{ color: "#474E68", fontFamily: "sans-serif" }}
                  >
                    No qualification mentioned by company.
                  </Typography>
                </Box>
              )}

              {/* Additional Job Information */}
              {(job?.duration || job?.companyType) && (
                <Box sx={{ mb: 3 }}>
                  <Typography
                    sx={{
                      fontWeight: "700",
                      color: "#404258",
                      mb: 2,
                      fontFamily: "Poppins",
                    }}
                  >
                    Additional Information:
                  </Typography>
                  <Grid container spacing={2}>
                    {job?.duration && (
                      <Grid item xs={12} sm={4}>
                        <Box
                          sx={{
                            p: 1.5,
                            borderRadius: 1.5,
                            bgcolor: "#f8f9fa",
                            border: "1px solid #e9ecef",
                            textAlign: "center",
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "0.8rem",
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
                            p: 1.5,
                            borderRadius: 1.5,
                            bgcolor: "#f8f9fa",
                            border: "1px solid #e9ecef",
                            textAlign: "center",
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "0.8rem",
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
                    }}
                  >
                    Job Tags:
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {job.tags.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        variant="outlined"
                        sx={{
                          color: "#404258",
                          borderColor: "#404258",
                          fontFamily: "sans-serif",
                          fontSize: "0.8rem",
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
                  <Box
                    sx={{
                      p: 2,
                    }}
                  >
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

              {/* Category and Functional Area */}
              {(job?.category || job?.functionalArea) && (
                <Box sx={{ mb: 3 }}>
                  <Typography
                    sx={{
                      fontWeight: "700",
                      color: "#404258",
                      mb: 2,
                      fontFamily: "Poppins",
                    }}
                  >
                    Job Category:
                  </Typography>
                  <Grid container spacing={2}>
                    {job?.category && (
                      <Grid item xs={12} sm={6}>
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            bgcolor: "#f8f9fa",
                            border: "1px solid #e9ecef",
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "0.8rem",
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
                            p: 2,
                            borderRadius: 2,
                            bgcolor: "#f8f9fa",
                            border: "1px solid #e9ecef",
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "0.8rem",
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
            sx={{ fontWeight: "bold" }}
          >
            Similar Job Posts
          </Typography>
          <Grid container spacing={2}>
            {similarJobs && similarJobs.length > 0 ? (
  // Show similar jobs when available
  similarJobs.slice(0, 2).map((job, index) => (
    <Grid item xs={12} key={index} sx={{ cursor: "pointer" }}>
      <JobCard job={job} flag={true} />
    </Grid>
  ))
) : (
  // Premium message when no similar jobs found
  <Grid item xs={12}>
    <Box
      sx={{
        textAlign: 'center',
        py: 8,
        px: 3,
        backgroundColor: '#fafafa',
        borderRadius: 1,
        border: '1px solid #f0f0f0',
        position: 'relative',
      }}
    >
      {/* Subtle accent line */}
      <Box
        sx={{
          width: 48,
          height: 2,
          backgroundColor: '#333',
          margin: '0 auto 32px auto',
          borderRadius: 1,
        }}
      />

      {/* Main Message */}
      <Typography
        sx={{
          fontFamily: 'Satoshi, sans-serif',
          fontWeight: 600,
          fontSize: '24px',
          color: '#1a1a1a',
          mb: 3,
          letterSpacing: '-0.01em',
        }}
      >
        Great Minds Think Alike!
      </Typography>

      {/* Witty Professional Message */}
      <Typography
        sx={{
          fontFamily: 'Poppins, sans-serif',
          fontWeight: 400,
          fontSize: '16px',
          color: '#666',
          lineHeight: 1.6,
          maxWidth: 420,
          margin: '0 auto 32px auto',
        }}
      >
        This role is so exceptional that we're still curating matches worthy of its caliber. 
        Our team is working behind the scenes to discover opportunities that match 
        your impeccable taste.
      </Typography>

      {/* Minimal Call to Action */}
      <Typography
        sx={{
          fontFamily: 'Satoshi, sans-serif',
          fontWeight: 500,
          fontSize: '14px',
          color: '#999',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}
      >
        Stay tuned for extraordinary matches
      </Typography>
    </Box>
  </Grid>
)}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default JobDetail;
