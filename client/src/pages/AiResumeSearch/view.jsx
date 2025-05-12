// AiResumeSearch.jsx
import React, { useState,useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Modal,
  Typography,
  CircularProgress,
  Autocomplete,
  Container,
  createTheme,
  ThemeProvider,
  Paper,
  Chip,
  Stack,
  alpha,
} from '@mui/material';
import ResumeCard from '../ResumeSearch/ResumeCard/view';
import { skillsList } from '../../assets/mock';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';

// Premium theme with refined black accents, using Satoshi & Poppins
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { 
      main: '#000000',
      light: alpha('#000000', 0.8),
    },
    secondary: {
      main: '#555555',
    },
    background: { 
      default: '#ffffff', 
      paper: '#ffffff' 
    },
    text: { 
      primary: '#111111', 
      secondary: '#555555' 
    },
    divider: '#e0e0e0',
  },
  typography: {
    fontFamily: ['Satoshi', 'Poppins', 'sans-serif'].join(', '),
    h5: { 
      fontFamily: 'Satoshi, sans-serif',
      fontWeight: 700, 
      fontSize: '1.5rem',
      letterSpacing: '-0.02em',
    },
    h6: { 
      fontFamily: 'Satoshi, sans-serif',
      fontWeight: 600, 
      fontSize: '1.25rem',
      letterSpacing: '-0.01em',
    },
    body1: { 
      fontFamily: 'Poppins, sans-serif',
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    button: {
      fontFamily: 'Satoshi, sans-serif',
      fontWeight: 600,
      letterSpacing: '0.01em',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 20px rgba(0,0,0,0.04)',
          border: '1px solid #f0f0f0',
        },
        elevation1: {
          boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          padding: '10px 24px',
          fontWeight: 600,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          },
        },
        contained: {
          border: '1px solid transparent',
        },
        outlined: {
          borderColor: '#e0e0e0',
          '&:hover': {
            borderColor: '#000000',
            backgroundColor: 'rgba(0,0,0,0.02)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': { 
            borderRadius: 8,
            backgroundColor: '#fafafa',
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: '#f5f5f5',
            },
            '&.Mui-focused': {
              backgroundColor: '#ffffff',
              boxShadow: '0 0 0 2px rgba(0,0,0,0.1)',
            },
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#e0e0e0',
          },
          '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#000000',
            borderWidth: '1px',
          },
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': { 
            backgroundColor: '#fafafa',
            '&:hover': {
              backgroundColor: '#f5f5f5',
            },
            '&.Mui-focused': {
              backgroundColor: '#ffffff',
            },
          },
        },
        paper: {
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '1px solid #f0f0f0',
        },
        option: {
          '&:hover': {
            backgroundColor: 'rgba(0,0,0,0.04)',
          },
          '&.Mui-focused': {
            backgroundColor: 'rgba(0,0,0,0.08)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontFamily: 'Satoshi, sans-serif',
          fontWeight: 500,
          backgroundColor: '#f0f0f0',
          '&:hover': {
            backgroundColor: '#e8e8e8',
          },
        },
        deleteIcon: {
          color: '#555555',
          '&:hover': {
            color: '#000000',
          },
        },
      },
    },
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          color: '#000000',
        },
      },
    },
  },
});

// Enhanced modal styling
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 550,
  bgcolor: 'background.paper',
  p: 4,
  boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
  border: '1px solid #f0f0f0',
  outline: 'none',
};

// Resume count options as chips
const resumeCountOptions = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

export default function AiResumeSearch() {
   const [jobDescription, setJobDescription] = useState('');
  const [bodySkills, setBodySkills] = useState([]);
  const [numResumes, setNumResumes] = useState(10);
  const [isModalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resumes, setResumes] = useState([]);

  // On mount, load from sessionStorage
  useEffect(() => {
    const savedDesc = sessionStorage.getItem('ai_jobDescription');
    const savedSkills = sessionStorage.getItem('ai_bodySkills');
    const savedCount = sessionStorage.getItem('ai_numResumes');
    const savedResumes = sessionStorage.getItem('ai_resumes');
    if (savedDesc) setJobDescription(savedDesc);
    if (savedSkills) setBodySkills(JSON.parse(savedSkills));
    if (savedCount) setNumResumes(Number(savedCount));
    if (savedResumes) setResumes(JSON.parse(savedResumes));
  }, []);

  // Persist to sessionStorage when these states change
  useEffect(() => {
    sessionStorage.setItem('ai_jobDescription', jobDescription);
  }, [jobDescription]);
  useEffect(() => {
    sessionStorage.setItem('ai_bodySkills', JSON.stringify(bodySkills));
  }, [bodySkills]);
  useEffect(() => {
    sessionStorage.setItem('ai_numResumes', numResumes.toString());
  }, [numResumes]);
  useEffect(() => {
    sessionStorage.setItem('ai_resumes', JSON.stringify(resumes));
  }, [resumes]);

  const handlePromptSubmit = (e) => {
    e.preventDefault();
    if (jobDescription.trim()) setModalOpen(true);
  };

  const handleModalSubmit = async () => {
    setLoading(true);
    try {
      const resp = await fetch('https://highimpacttalent.onrender.com/api-v1/ai/shortlisting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription, skills: bodySkills }),
      });
      const data = await resp.json();
      const list = data.recommendedCandidates || [];
      setResumes(list.slice(0, numResumes));
      setModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{width: '100%', backgroundColor: '#fff' ,height: resumes?.length == 0 ? '80vh' : 'auto'}}>
      <Container maxWidth="md" sx={{ py: 6 }}>
        {/* Premium Search Bar */}
        <Paper
          component="form"
          onSubmit={handlePromptSubmit}
          elevation={0}
          sx={{ 
            p: 3, 
            mb: 5,    
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' }, 
            gap: 2, 
            alignItems: 'flex-start',
            border: '1px solid #e8e8e8',
            transition: 'all 0.2s ease',
            '&:hover': {
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              borderColor: '#d0d0d0',
            },
          }}
        >
          <TextField
            fullWidth
            multiline
            minRows={3}
            variant="outlined"
            placeholder="Enter job description..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            InputProps={{
              sx: {
                '&::placeholder': {
                  fontStyle: 'italic',
                  color: '#999999',
                },
              },
            }}
          />
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            endIcon={<SearchIcon />}
            sx={{ 
              minWidth: { xs: '100%', sm: '140px' },
              height: { xs: 'auto', sm: '100%' },
              alignSelf: { xs: 'stretch', sm: 'stretch' },
              whiteSpace: 'nowrap',
            }}
          >
            AI Search
          </Button>
        </Paper>

        {/* Enhanced Skills & Count Modal */}
        <Modal 
          open={isModalOpen} 
          onClose={() => setModalOpen(false)}
          aria-labelledby="modal-title"
        >
          <Paper sx={modalStyle}>
            <Typography id="modal-title" variant="h5" gutterBottom sx={{ mb: 3 }}>
              Refine Your Search
            </Typography>
            
            <Typography variant="body1" gutterBottom sx={{ mb: 2, color: 'text.secondary' }}>
              Select skills you're looking for:
            </Typography>
            
            <Autocomplete
              multiple
              options={skillsList}
              value={bodySkills}
              onChange={(e, v) => setBodySkills(v)}
              filterSelectedOptions
              filterOptions={(options, { inputValue }) =>
                options
                  .filter((opt) =>
                    opt.toLowerCase().includes(inputValue.toLowerCase())
                  )
                  .slice(0, 8)
              }
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  placeholder="Search skills..."
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <>
                        <SearchIcon color="secondary" sx={{ mr: 1, ml: 1 }} />
                        {params.InputProps.startAdornment}
                      </>
                    )
                  }}
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    label={option}
                    {...getTagProps({ index })}
                    sx={{ 
                      backgroundColor: 'rgba(0,0,0,0.06)',
                      '&:hover': { backgroundColor: 'rgba(0,0,0,0.1)' },
                      '& .MuiChip-deleteIcon': {
                        color: 'rgba(0,0,0,0.4)',
                        '&:hover': { color: 'rgba(0,0,0,0.7)' },
                      }
                    }}
                  />
                ))
              }
              sx={{ mb: 4 }}
            />

            <Typography variant="body1" gutterBottom sx={{ mb: 2, color: 'text.secondary' }}>
              Number of resumes to show:
            </Typography>
            
            <Stack 
              direction="row" 
              spacing={1} 
              flexWrap="wrap" 
              useFlexGap 
              sx={{ mb: 4, gap: 1 }}
            >
              {resumeCountOptions.map((count) => (
                <Chip
                  key={count}
                  label={count}
                  onClick={() => setNumResumes(count)}
                  color={numResumes === count ? 'primary' : 'default'}
                  variant={numResumes === count ? 'filled' : 'outlined'}
                  sx={{ 
                    fontWeight: numResumes === count ? 600 : 400,
                    backgroundColor: numResumes === count ? 'black' : 'transparent',
                    color: numResumes === count ? 'white' : 'inherit',
                    borderColor: numResumes === count ? 'black' : '#e0e0e0',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    '&:hover': {
                      backgroundColor: numResumes === count ? 'black' : 'rgba(0,0,0,0.04)',
                      borderColor: numResumes === count ? 'black' : '#aaaaaa',
                    }
                  }}
                />
              ))}
            </Stack>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
              <Button 
                onClick={() => setModalOpen(false)}
                variant="outlined"
                sx={{ px: 3 }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleModalSubmit}
                disabled={loading || bodySkills.length === 0}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <AddIcon />}
                sx={{ px: 4 }}
              >
                {loading ? 'Processing...' : 'Find Candidates'}
              </Button>
            </Box>
          </Paper>
        </Modal>

        {/* Single Column Resume List */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {resumes.length > 0 && (
            <Typography variant="h6" sx={{ mb: 1, mt: 2 }}>
              Top {resumes.length} Candidates
            </Typography>
          )}
          
          {resumes.map((resume) => (
            <ResumeCard key={resume._id} resume={resume} />
          ))}
        </Box>
      </Container>
      </Box>
    </ThemeProvider>
  );
}