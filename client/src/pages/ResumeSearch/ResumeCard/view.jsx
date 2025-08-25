import React, { useState, useMemo } from "react";
import {
  Box,
  Card,
  CardContent,
  
  Typography,
  Chip,
  Button,
  IconButton,
  Stack,
  Divider,
  Drawer,
  Grid,
  Fade,
  Collapse,
  LinearProgress,
  Tooltip,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SchoolIcon from "@mui/icons-material/School";
import CloseIcon from "@mui/icons-material/Close";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DownloadIcon from "@mui/icons-material/Download";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";

// Premium, compact and responsive ResumeCard component (MUI v5)
// - Uses user's data shape (supports RAG and non-RAG variants)
// - Drawer includes inline PDF viewer and download
// - Polished visuals: soft gradient badge, subtle shadow, timeline, skill overflow

export default function ResumeCard({ resume, index = 0 }) {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [showPdfInline, setShowPdfInline] = useState(false);
  const [expandedExp, setExpandedExp] = useState(false);

  const isRAG = resume && resume.retrieval_score !== undefined;

  const name = isRAG
    ? resume.personal_info?.name || "Name not available"
    : resume.name || "Name not available";

  const role = isRAG
    ? resume.professional_profile?.current_role
    : resume.currentJobRole;
  const company = isRAG
    ? resume.professional_profile?.current_company
    : resume.currentCompany;

  const location = isRAG ? resume.personal_info?.location : resume.location;
  const experience = isRAG
    ? resume.professional_profile?.total_experience_stated
    : resume.experience;

  const education = isRAG ? resume.education : resume.education;
  const skills = isRAG ? resume.skills || [] : resume.technicalSkills || [];
  const work = resume.work_experience || [];
  const matchPercent = isRAG ? Math.round((resume.retrieval_score || 0) * 100) : null;
  const resumeUrl = resume?.metadata?.resume_url || null;

  const topSkills = useMemo(() => skills.slice(0, 6), [skills]);

  const formatExperience = (exp) => {
    if (!exp) return "Not specified";
    if (typeof exp === "string" && exp.toLowerCase().includes("year")) return exp;
    return `${exp} years`;
  };

  return (
    <>
      <Fade in timeout={600 + index * 80}>
        <Card
          elevation={0}
          sx={{
            height: "100%",
            borderRadius: 2,
            background: "linear-gradient(180deg, #ffffff 0%, #fbfbfd 100%)",
            border: "1px solid rgba(16,24,40,0.06)",
            boxShadow: "0 8px 30px rgba(14, 20, 40, 0.06)",
            position: "relative",
            overflow: "visible",
          }}
        >
         

          <CardContent sx={{ p: 3.25 }}>
          {/* Header: name on top + match badge */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 900, fontSize: '1.05rem' }}>{name}</Typography>
              <Typography variant="body2" sx={{ color: '#6b7280', mt: 0.5 }}>{role} {company && `— ${company}`}</Typography>
              <Box sx={{ mt: 1, display: 'flex', gap: 1, alignItems: 'center' }}>
                {location && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <LocationOnIcon sx={{ fontSize: 14, color: '#9ca3af' }} />
                    <Typography variant="caption" sx={{ color: '#6b7280' }}>{location}</Typography>
                  </Box>
                )}

                {experience && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <TrendingUpIcon sx={{ fontSize: 14, color: '#9ca3af' }} />
                    <Typography variant="caption" sx={{ color: '#6b7280' }}>{formatExperience(experience)}</Typography>
                  </Box>
                )}
              </Box>
            </Box>

            {matchPercent !== null && (
              <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, bgcolor: 'rgba(16,24,40,0.06)', px: 1.25, py: 0.5, borderRadius: 2 }}>
                <Typography sx={{ fontWeight: 800, fontSize: '0.9rem' }}>{matchPercent}%</Typography>
                <Typography variant="caption" sx={{ color: '#6b7280' }}>Match</Typography>
              </Box>
            )}
          </Box>

          <Grid container spacing={2} alignItems="flex-start">
            <Grid item xs={12} md={9}>
              {/* Recent experience — concise (no responsibilities) */}
              <Box sx={{ mb: 1 }}>
                {work.slice(0, expandedExp ? 10 : 3).map((w, i) => (
                  <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.75 }}>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>{w.role}</Typography>
                      <Typography variant="caption" sx={{ color: '#6b7280' }}>{`Worked at ${w.company} • ${w.duration}`}</Typography>
                    </Box>
                    <Box sx={{ display: { xs: 'none', sm: 'block' }, textAlign: 'right' }}>
                      <Typography variant="caption" sx={{ color: '#9ca3af' }}>{w.company}</Typography>
                      <Typography variant="caption" sx={{ display: 'block', color: '#9ca3af' }}>{w.duration}</Typography>
                    </Box>
                  </Box>
                ))}

                {work.length > 3 && (
                  <Button size="small" onClick={() => setExpandedExp((s) => !s)} sx={{ textTransform: 'none', fontWeight: 700 }}>{expandedExp ? 'Show less' : `View all ${work.length} roles`}</Button>
                )}
              </Box>

              {/* Skills */}
              <Box sx={{ mt: 1.25 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#374151' }}>Top skills</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                  {topSkills.map((s, i) => (
                    <Chip key={i} label={s} size="small" sx={{ background: '#fbfbfd', border: '1px solid rgba(16,24,40,0.06)', fontWeight: 700, height: 30 }} />
                  ))}
                  {skills.length > topSkills.length && (
                    <Chip label={`+${skills.length - topSkills.length}`} size="small" sx={{ fontWeight: 800, height: 30, bgcolor: '#111827', color: '#fff' }} />
                  )}
                </Box>
              </Box>

              {/* Action row */}
              <Box sx={{ display: 'flex', gap: 1.25, alignItems: 'center', mt: 2 }}>
                <Button variant="contained" onClick={() => { setOpenDrawer(true); setShowPdfInline(true); }} startIcon={<WorkOutlineIcon />} sx={{ boxShadow: 'none', backgroundColor: '#111827', textTransform: 'none', fontWeight: 700 }}>View profile</Button>
              </Box>


            </Grid>

            <Grid item xs={12} md={3}>
              {/* Small right column: compact stats or badges */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ bgcolor: '#f8fafc', borderRadius: 1, p: 1 }}>
                  <Typography variant="caption" sx={{ fontWeight: 800 }}>Experience</Typography>
                  <Typography variant="body2" sx={{ color: '#374151' }}>{formatExperience(experience)}</Typography>
                </Box>

                <Box sx={{ bgcolor: '#f8fafc', borderRadius: 1, p: 1 }}>
                  <Typography variant="caption" sx={{ fontWeight: 800 }}>Education</Typography>
                  <Typography variant="body2" sx={{ color: '#374151' }}>{education?.[0]?.institution}</Typography>
                </Box>

              </Box>
            </Grid>
          </Grid>
</CardContent>
        </Card>
      </Fade>

      {/* Drawer for full profile + inline PDF */}
      <Drawer anchor="right" open={openDrawer} onClose={() => { setOpenDrawer(false); setShowPdfInline(false); }}>
        <Box sx={{ width: { xs: '100vw', sm: 720, md: 880 }, height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* header */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2.25, borderBottom: '1px solid rgba(15,23,42,0.06)' }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>{name}</Typography>
              <Typography variant="caption" sx={{ color: '#6b7280' }}>{role} {company && `@ ${company}`}</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              {resumeUrl && (
                <Button startIcon={<DownloadIcon />} variant="outlined" href={resumeUrl} target="_blank" rel="noreferrer" sx={{ textTransform: 'none', fontWeight: 700 }}>
                  Download
                </Button>
              )}
              <IconButton onClick={() => { setOpenDrawer(false); setShowPdfInline(false); }}>
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>

          {/* content */}
          <Box sx={{ flex: 1, overflowY: 'auto', p: 3 }}>
            {/* Contact */}
            <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1 }}>Contact</Typography>
            <Stack spacing={0.5} sx={{ mb: 2 }}>
              {resume.personal_info?.contact?.email && (<Typography variant="body2">Email: {resume.personal_info.contact.email}</Typography>)}
              {resume.personal_info?.contact?.phone && (<Typography variant="body2">Phone: {resume.personal_info.contact.phone}</Typography>)}
              {resume.personal_info?.contact?.linkedin && (<Typography variant="body2">LinkedIn: {resume.personal_info.contact.linkedin}</Typography>)}
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1 }}>Professional profile</Typography>
            <Typography variant="body2" sx={{ color: '#4b5563', mb: 2 }}>{role} at {company} • {formatExperience(experience)}</Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1 }}>Education</Typography>
            <Stack spacing={1} sx={{ mb: 2 }}>
              {education?.map((ed, i) => (
                <Typography key={i} variant="body2">{ed.institution} {ed.class_of ? `• ${ed.class_of}` : ''}</Typography>
              ))}
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1 }}>Work Experience</Typography>
            <Box>
              {work.map((w, i) => (
                <Box key={i} sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 800 }}>{w.role} <span style={{ color: '#6b7280', fontWeight: 600 }}>@ {w.company}</span></Typography>
                  <Typography variant="caption" sx={{ color: '#9ca3af' }}>{w.duration}</Typography>
                  <ul style={{ marginTop: 6, paddingLeft: 16 }}>
                    {w.responsibilities?.map((r, ri) => (
                      <li key={ri}><Typography variant="body2" sx={{ color: '#374151' }}>{r}</Typography></li>
                    ))}
                  </ul>
                </Box>
              ))}
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1 }}>Skills</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {skills.map((s, i) => (<Chip key={i} label={s} size="small" sx={{ fontWeight: 700 }} />))}
            </Box>

            {/* Inline PDF viewer */}
            {showPdfInline && resumeUrl && (
              <Box sx={{ mt: 3 }}>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1 }}>Resume (PDF)</Typography>
                <Box sx={{ width: '100%', height: { xs: '60vh', sm: '70vh' }, borderRadius: 1, overflow: 'hidden', boxShadow: '0 8px 30px rgba(2,6,23,0.08)' }}>
                  <iframe
                    title="resume-pdf"
                    src={resumeUrl}
                    style={{ width: '100%', height: '100%', border: '0' }}
                  />
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
