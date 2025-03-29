import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Tabs,
  Tab,
  IconButton,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { FiEye } from "react-icons/fi";
import { useSelector } from "react-redux";
import { openDialog } from "uploadcare-widget";
import axios from "axios";

const ResumeUpload = (userInfo) => {
  const { user } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);


  const handleView = () => {
    if (userInfo) {
        window.open(userInfo.userInfo.cvUrl, "_blank"); // Opens in a new tab
    } else {
        alert("No CV available.");
    }
};

const handleUpload = () => {
  openDialog({}, { publicKey: "fe3e0052e9f2e9540955" }).done((file) => {
    setLoading(true);
    file.done(async (file) => {
      try {
        const response = await axios.post(
          "https://highimpacttalent.onrender.com/api-v1/user/upload-resume",
          { url: file.cdnUrl },
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.data) { 
          throw new Error("No response from server");
        }
      } catch (error) {
        console.error("Resume upload error:", error);
        alert("Failed to save resume. Please try again.");
      } finally {
        setLoading(false);
      }
    });
  });
};
console.log("Time Now",userInfo.userInfo)
  return (
    <Box sx={{}}>
        <Box sx={{mb:2,display:"flex",justifyContent:"space-between"}}>
        <Tabs value={0}>
        <Tab sx={{
      "&.MuiTab-root": { color: "#404258",fontWeight: 700,textTransform: "none", }, 
    }} label="Resume"
  />
      </Tabs>
      </Box>

      <Card variant="outlined" sx={{ py: 2, borderRadius: 2,border:"1px solid #00000040" }}>
        
          <CardContent>
            <Box sx={{display:"flex",justifyContent:"center",gap:1}}>
            <Button
              component="span"
              variant="contained"
              startIcon={!loading && <CloudUploadIcon />}
              sx={{ borderRadius: 16 }}
              onClick={handleUpload}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Upload Resume"}
            </Button>
              <Button
                component="span"
                variant="contained"
                startIcon={<FiEye />}
                sx={{borderRadius:16}}
                onClick={handleView}
              >
                View Resume
              </Button>
            </Box>
            <Typography
              variant="caption"
              display="block"
              textAlign="center"
              mt={1}
              color="#808195"
            >
              Supported Formats: doc, docx, rtf, pdf, up to 2 MB
            </Typography>
          </CardContent>
      </Card>
    </Box>
  );
};

export default ResumeUpload;
