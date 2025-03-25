import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Paper,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

const AIChatbot = ({ setFilters }) => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: "Welcome! Please explain what kind of candidate you are looking for.",
      sender: "bot",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (input.trim() === "") return;
    
    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    
    try {
      const response = await fetch("https://highimpacttalent.onrender.com/api-v1/ai/AI-analyser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ recruiterQuery: input }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setFilters({
          location: data.filters.location || "",
          exp: data.filters.exp || 0,
          currentCompany: data.filters.currentCompany || "",
          isConsultant: data.filters.isConsultant || false,
          instituteName: data.filters.instituteName || "",
          yearOfPassout: data.filters.yearOfPassout || "",
          workExpCompany: data.filters.workExpCompany || "",
          minWorkExp: data.filters.minWorkExp || 0,
          skills: data.filters.skills || [],
          topCompany: data.filters.topCompany || false,
          topInstitutes: data.filters.topInstitutes || false,
          companiesWorkedAt: data.filters.companiesWorkedAt?.map(company => company.toUpperCase()) || [],
          jobRoles: data.filters.jobRoles || [],
        });

        setMessages((prev) => [
          ...prev,
          { text: "Filters have been applied successfully!", sender: "bot" },
        ]);
        setOpen(false);
      } else {
        setMessages((prev) => [
          ...prev,
          { text: "Sorry, I couldn't process the request. Please try again.", sender: "bot" },
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { text: "Error contacting AI service. Please try again later.", sender: "bot" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
     <IconButton sx={{ background: "linear-gradient(45deg, #841a7b, #ff1493, #00ffff)", color: "white" }} onClick={() => setOpen(true)}>
        <AutoAwesomeIcon />
      </IconButton>
      
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
          AI Recruitment Assistant
          <IconButton onClick={() => setOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Paper sx={{ maxHeight: 300, overflowY: "auto", padding: 2, backgroundColor: "#f5f5f5" }}>
            {messages.map((msg, index) => (
              <Box key={index} sx={{ textAlign: msg.sender === "user" ? "right" : "left", marginBottom: "8px" }}>
                <Typography
                  variant="body2"
                  sx={{
                    display: "inline-block",
                    padding: "8px 12px",
                    borderRadius: "12px",
                    backgroundColor: msg.sender === "user" ? "#1976d2" : "#e0e0e0",
                    color: msg.sender === "user" ? "white" : "black",
                  }}
                >
                  {msg.text}
                </Typography>
              </Box>
            ))}
          </Paper>
        </DialogContent>

        <DialogActions>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Describe the candidate you're looking for..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
          <Button onClick={handleSend} variant="contained" disabled={loading}>
            {loading ? "Processing..." : "Send"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AIChatbot;