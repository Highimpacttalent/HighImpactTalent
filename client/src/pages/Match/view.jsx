import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import JobCard from '../../components/JobCard';
import NoJobFound from '../FindJob/NoJob';
import { useSelector } from 'react-redux';
import { apiRequest } from '../../utils';

const JobRecommendationsComponent = () => {
  const { user } = useSelector((state) => state.user);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = user?.token || localStorage.getItem('authToken');

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const response = await apiRequest({
          url: '/jobs/match-jobs',
          method: 'GET',
          token,
        });
        const recs = response.finalResponse || [];
        setJobs(recs);
      } catch (err) {
        console.error('Error fetching recommendations:', err);
        setError('Unable to load recommended jobs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendations();
  }, [token]);

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h3" sx={{ fontWeight: 800, mb: 4, textAlign: 'center' }}>
        Recommended Jobs for You
      </Typography>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <CircularProgress size={72} />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 4, mx: 'auto', maxWidth: 600 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && (
        jobs.length > 0 ? (
          <Grid container spacing={4} sx={{ width: '100%' }}>
            {jobs.map((job) => (
              <Grid key={job._id} item xs={12}>
                <JobCard job={job} user={user} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ mt: 10, display: 'flex', justifyContent: 'center' }}>
            <NoJobFound message="No recommended jobs found. Try updating your profile preferences." />
          </Box>
        )
      )}
    </Container>
  );
};

export default JobRecommendationsComponent;
