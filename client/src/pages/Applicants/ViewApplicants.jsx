import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Grid,
  Paper,
  Card,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";
import ViewAnalytics from "../AnalyticApplicant";
import { apiRequest } from "../../utils";
import { LinkedIn } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";


const JobApplications = () => {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [resumeLinks, setResumeLinks] = useState({});
  const [showAnalytics, setShowAnalytics] = useState(false);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await apiRequest({
          url: `application/get-applications/${jobId}`,
          method: "GET",
        });

        if (!response.success) {
          throw new Error(response.message || "Failed to fetch applications");
        }

        setApplications(response.applications);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [jobId]);

  const handleViewResume = (id, cvUrl) => {
    setResumeLinks((prev) => ({ ...prev, [id]: cvUrl }));
  };

  return (
    <Box sx={{bgcolor:"white",p:4}}>
            <Typography sx={{textAlign:"center",mt:2,color:"#24252C",fontFamily:"Satoshi",mb:4,fontWeight:700,fontSize:"30px"}}>Job Applications</Typography>
     <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Button variant="contained" sx={{bgcolor:"#3C7EFC",py:2,px:4,borderRadius:50,fontFamily:"Satoshi",fontWeight:700,fontSize:"16px",textTransform:"none",mb:4}}
          onClick={() => setShowAnalytics(!showAnalytics)}
        >
          {showAnalytics ? "Close Analytics" : "View Analytics"}
        </Button>
      </Box>

      {showAnalytics ? (
        <ViewAnalytics jobId={jobId} />
      ) : (
        <>
          {loading && (
            <CircularProgress sx={{ display: "block", margin: "20px auto" }} />
          )}
          {error && (
            <Typography color="error" align="center">
              {error}
            </Typography>
          )}
          {!loading && !error && applications.length === 0 && (
            <Typography align="center">
              No applications found for this job.
            </Typography>
          )}
          {!loading && !error && applications.length > 0 && (
            <Grid container sx = {{gap:{sm:1,xs:1,md:0,lg:0}}}>
              {applications.map((app, index) => (
                <Grid item xs={12} sm={6} md={3} key={app._id}>
                  <Card sx={{border:"1px solid grey",borderRadius:4,p:2,height:"350px",width:"320px",display:"flex",flexDirection:"column",justifyContent:"space-evenly"}}>
                    <Box display="flex" flexDirection="column" alignItems="center" gap={2} mb={2}>
                      <Avatar
                        src={app.applicant.profileUrl}
                        sx={{ width: 90, height: 90 }}
                      />
                      <Box>
                        <Typography fontWeight="bold">
                          {app.applicant.firstName} {app.applicant.lastName}
                        </Typography>
                      </Box>
                    </Box>

            <Box sx={{display:"flex",justifyContent:"center"}}> 
                <Box sx={{width:"78%"}}>
                    <Typography variant="body2" mb={0.5}>
                      <strong>Experience:</strong> {app.applicant.experience} years
                    </Typography>
                    <Typography variant="body2" mb={0.5}>
                      <strong>Join Consulting:</strong> {app.applicant.joinConsulting}
                    </Typography>
                    <Typography variant="body2" >
                      <strong>Open to Relocate:</strong> {app.applicant.openToRelocate}
                    </Typography>
                    <Typography variant="body2" mb={1}>
                      <strong>Social:</strong> 
                      <Button
                        href={app.applicant.linkedinLink}
                      >
                        <LinkedIn/>
                      </Button>
                    </Typography>
                    </Box>
         </Box>
                    <Box mt={2} display="flex" gap={1} flexWrap="wrap" justifyContent="center">
                      

                      <Button
                        variant="contained"
                        role="link"
                        color="primary"
                        sx={{borderRadius:16,px:2,py:1,fontFamily:"Satoshi",textTransform:"none"}}
                        size="small"
                        onClick={() => navigate("/view-profile", { state: { applicant: app.applicant } })}
                      >
                        View Profile
                      </Button>
                      <Button
                        variant="contained"
                        role="link"
                        color="primary"
                        sx={{borderRadius:16,px:2,py:1,fontFamily:"Satoshi",textTransform:"none"}}
                        size="small"
                        href={app.applicant.cvUrl}
                      >
                        View Resume
                      </Button>
                    </Box>

                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}
    </Box>
  );
};

export default JobApplications;
